import { createHash } from 'node:crypto';
import { load } from 'cheerio';

export const RECORD_PREFIX = 'galen:';
const hash = (value) => createHash('sha256').update(value).digest('hex');

export const indexSettings = {
  searchableAttributes: [
    ...Array.from({ length: 7 }, (_, level) => `unordered(hierarchy.lvl${level})`),
    'content',
  ],
  attributesForFaceting: ['filterOnly(lang)', 'filterOnly(tags)', 'type'],
  attributesToHighlight: ['hierarchy', 'content'],
  attributesToSnippet: ['content:20'],
  attributeForDistinct: 'url',
  distinct: true,
  customRanking: ['desc(weight.level)', 'asc(weight.position)'],
};

// Bound each record by UTF-8 bytes, including Chinese text and emoji.
function chunks(text, limit = 2000) {
  const result = [];
  let part = '';
  let size = 0;
  for (const char of text) {
    const bytes = Buffer.byteLength(char);
    if (size + bytes > limit) {
      result.push(part);
      part = '';
      size = 0;
    }
    part += char;
    size += bytes;
  }
  if (part) result.push(part);
  return result;
}

export function extractRecords(html, pageUrl, frontmatter = {}) {
  if (frontmatter.search === false || frontmatter.draft === true) return [];
  const $ = load(html);
  const doc = $('main .vp-doc').first();
  if (!doc.length || !doc.find('h1').length) return [];
  doc.find('script, style, .header-anchor, .VPDocFooter, .vp-code-group .tabs, .line-numbers-wrapper, .copy, [data-search-exclude]').remove();
  const lang = $('html').attr('lang');
  if (!lang) throw new Error(`Missing language: ${pageUrl}`);
  const english = lang.startsWith('en');
  const category = /\/posts\//.test(pageUrl) ? (english ? 'Blog' : '博客')
    : /\/notes\//.test(pageUrl) ? (english ? 'Notes' : '笔记') : (english ? 'Pages' : '页面');
  const hierarchy = Object.fromEntries(Array.from({ length: 7 }, (_, i) => [`lvl${i}`, null]));
  hierarchy.lvl0 = category;
  hierarchy.lvl1 = doc.find('h1').first().text().trim();
  const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags.map(String) : [];
  let anchor = '';
  let position = 0;
  const occurrences = new Map();
  const records = [];
  function add(type, content, level) {
    const url = pageUrl + (anchor ? `#${encodeURIComponent(anchor)}` : '');
    const identity = `${url}:${type}`;
    const ordinal = occurrences.get(identity) || 0;
    occurrences.set(identity, ordinal + 1);
    const record = {
      objectID: RECORD_PREFIX + hash(`${identity}:${ordinal}`).slice(0, 32),
      url,
      url_without_anchor: pageUrl,
      anchor,
      hierarchy: { ...hierarchy },
      content,
      type,
      lang,
      tags,
      weight: { level, position: position++ },
    };
    record.recordHash = hash(JSON.stringify(record));
    if (Buffer.byteLength(JSON.stringify(record)) > 9000) {
      throw new Error(`Search record exceeds 9 KB: ${url}`);
    }
    records.push(record);
  }
  doc.find('h1, h2, h3, h4, h5, h6, p, li, pre, td, th').each((_, element) => {
    const node = $(element);
    const heading = /^h([1-6])$/.exec(element.tagName);
    if (heading) {
      const level = Number(heading[1]);
      hierarchy[`lvl${level}`] = node.text().trim();
      for (let i = level + 1; i <= 6; i++) hierarchy[`lvl${i}`] = null;
      anchor = node.attr('id') || '';
      add(`lvl${level}`, null, 7 - level);
      return;
    }
    // Nested list paragraphs, code, and tables get their own records once.
    const clone = node.clone();
    clone.find('ul, ol, p, pre, table').remove();
    const content = clone.text().replace(/\s+/g, ' ').trim();
    for (const part of chunks(content)) add('content', part, 0);
  });
  return records;
}

export function validateRecords(records) {
  if (!Array.isArray(records) || !records.length) {
    throw new Error('No search records generated; refusing to modify the remote index.');
  }
  const ids = new Set();
  for (const record of records) {
    if (!record.objectID?.startsWith(RECORD_PREFIX) || ids.has(record.objectID)
      || !record.url?.startsWith('/') || record.url.startsWith('//')
      || !record.lang || !record.hierarchy?.lvl1 || !record.recordHash
      || Buffer.byteLength(JSON.stringify(record)) > 9000) {
      throw new Error(`Invalid or duplicate search record: ${record.objectID}`);
    }
    ids.add(record.objectID);
  }
}

export function planSync(records, previous) {
  validateRecords(records);
  const old = new Map(previous.map((record) => [record.objectID, record.recordHash]));
  const current = new Set(records.map((record) => record.objectID));
  return {
    save: records.filter((record) => old.get(record.objectID) !== record.recordHash),
    remove: previous.filter((record) => record.objectID.startsWith(RECORD_PREFIX) && !current.has(record.objectID)).map((record) => record.objectID),
  };
}

export async function syncRecords(client, indexName, records) {
  validateRecords(records);
  const previous = [];
  await client.browseObjects({
    indexName,
    browseParams: { attributesToRetrieve: ['objectID', 'recordHash'] },
    aggregator: (response) => previous.push(...response.hits),
  });
  const plan = planSync(records, previous);
  const { taskID } = await client.setSettings({ indexName, indexSettings });
  await client.waitForTask({ indexName, taskID });
  // Never delete old records until all new/changed records have been published.
  if (plan.save.length) await client.saveObjects({ indexName, objects: plan.save, waitForTasks: true });
  if (plan.remove.length) await client.deleteObjects({ indexName, objectIDs: plan.remove, waitForTasks: true });
  return { saved: plan.save.length, removed: plan.remove.length, total: records.length };
}
