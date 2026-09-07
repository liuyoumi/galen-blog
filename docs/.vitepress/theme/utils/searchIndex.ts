import path from 'node:path';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createContentLoader, type SiteConfig } from 'vitepress';
import { extractRecords, validateRecords } from '../../../../scripts/algolia-records.mjs';
import { site } from '../../config/site';

export async function createSearchIndex(config: SiteConfig) {
  const pages = await createContentLoader('**/*.md').load();
  const records = [];
  for (const { url, frontmatter } of pages) {
    if (frontmatter.search === false || frontmatter.draft === true) continue;
    const filename = url.endsWith('/') ? `${url}index.html` : `${url.replace(/\.html$/, '')}.html`;
    const html = await readFile(path.join(config.outDir, filename.slice(1)), 'utf8');
    const pageUrl = `${config.site.base.replace(/\/$/, '')}${url}`;
    records.push(...extractRecords(html, pageUrl, frontmatter));
  }
  validateRecords(records);
  await mkdir(config.cacheDir, { recursive: true });
  await writeFile(path.join(config.cacheDir, 'algolia-records.json'), JSON.stringify({
    version: 1,
    appId: site.algolia.appId,
    indexName: site.algolia.indexName,
    records,
  }));
  console.log(`Search: generated ${records.length} records (local file only).`);
}
