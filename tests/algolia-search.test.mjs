import test from 'node:test';
import assert from 'node:assert/strict';
import { extractRecords, planSync, syncRecords, validateRecords } from '../scripts/algolia-records.mjs';

const page = (body, lang = 'zh-Hans') => `<html lang="${lang}"><body><nav>导航不应被索引</nav><main><div class="vp-doc"><h1 id="title">测试文章<a class="header-anchor">#</a></h1>${body}</div><footer>页脚不应被索引</footer></main></body></html>`;
const url = '/posts/2026/test';
const records = extractRecords(page('<h2 id="重复标题-1">中文章节</h2><p>正文内容</p>'), url);

test('indexes the rendered body with exact anchors, hierarchy, language and tags', () => {
  const result = extractRecords(page('<h2 id="a-1">章节</h2><h3 id="sub">子章节</h3><p>内容</p><h2 id="b">下一节</h2><p>下一段</p>'), url, { tags: ['JavaScript'] });
  assert.equal(result[0].hierarchy.lvl1, '测试文章');
  assert.equal(result[3].url, `${url}#sub`);
  assert.equal(result[3].hierarchy.lvl3, '子章节');
  assert.equal(result.at(-1).hierarchy.lvl3, null);
  assert.equal(result.at(-1).lang, 'zh-Hans');
  assert.deepEqual(result.at(-1).tags, ['JavaScript']);
  assert.equal(result.at(-1).url_without_anchor, url);
  assert.doesNotMatch(JSON.stringify(result), /导航不应|页脚不应|header-anchor/);
  assert.equal(records[2].url, `${url}#${encodeURIComponent('重复标题-1')}`);
  assert.equal(extractRecords(page('<p>English</p>', 'en-US'), '/en/posts/test')[1].lang, 'en-US');
});

test('honors search exclusion and draft flags', () => {
  assert.deepEqual(extractRecords(page('<p>hidden</p>'), url, { search: false }), []);
  assert.deepEqual(extractRecords(page('<p>draft</p>'), url, { draft: true }), []);
  assert.deepEqual(extractRecords('<main><div class="vp-doc">No title</div></main>', url), []);
});

test('splits long Unicode paragraphs without data loss and keeps records below Algolia limits', () => {
  const content = '中文🙂'.repeat(4000);
  const result = extractRecords(page(`<p>${content}</p>`), url);
  validateRecords(result);
  assert.equal(result.filter((r) => r.type === 'content').map((r) => r.content).join(''), content);
  assert.ok(result.every((r) => Buffer.byteLength(JSON.stringify(r)) < 9000));
});

test('nested lists and code appear once without surrounding UI', () => {
  const result = extractRecords(page('<ul><li>parent<ul><li><p>child</p></li></ul></li></ul><div class="language-js"><button class="copy">copy</button><span class="lang">js</span><pre><code>const value = 1</code></pre></div>'), url);
  assert.deepEqual(result.filter((r) => r.type === 'content').map((r) => r.content), ['parent', 'child', 'const value = 1']);
});

test('stable IDs update changed text and remove deleted sections or pages without touching unrelated records', () => {
  assert.deepEqual(planSync(records, records), { save: [], remove: [] });
  const changed = extractRecords(page('<h2 id="重复标题-1">中文章节</h2><p>修改后的正文</p>'), url);
  assert.equal(changed[2].objectID, records[2].objectID);
  assert.deepEqual(planSync(changed, records), { save: [changed[2]], remove: [] });
  const other = extractRecords(page('<p>另一篇</p>'), '/posts/other');
  const plan = planSync(changed, [...records, ...other, { objectID: 'not-managed' }]);
  assert.deepEqual(plan.remove, other.map((r) => r.objectID));
  const shortened = extractRecords(page(''), url);
  assert.deepEqual(planSync(shortened, records).remove, records.slice(1).map((r) => r.objectID));
});

test('rejects empty or duplicate records before any network changes', async () => {
  assert.throws(() => validateRecords([]), /No search records/);
  assert.throws(() => validateRecords([records[0], records[0]]), /duplicate/);
  await assert.rejects(syncRecords({}, 'test', []), /No search records/);
});

function mockClient(failUpload = false) {
  const events = [];
  return { events,
    browseObjects: async ({ aggregator }) => { events.push('browse'); aggregator({ hits: [{ objectID: 'galen:obsolete' }] }); },
    setSettings: async () => { events.push('settings'); return { taskID: 42 }; },
    waitForTask: async () => { events.push('wait'); },
    saveObjects: async ({ waitForTasks }) => { assert.equal(waitForTasks, true); events.push('save'); if (failUpload) throw new Error('Upload failed'); },
    deleteObjects: async ({ objectIDs, waitForTasks }) => { assert.deepEqual(objectIDs, ['galen:obsolete']); assert.equal(waitForTasks, true); events.push('delete'); },
  };
}

test('waits for settings and uploads before removing obsolete records', async () => {
  const client = mockClient();
  assert.deepEqual(await syncRecords(client, 'test', records), { saved: records.length, removed: 1, total: records.length });
  assert.deepEqual(client.events, ['browse', 'settings', 'wait', 'save', 'delete']);
});

test('failed upload never deletes existing records', async () => {
  const client = mockClient(true);
  await assert.rejects(syncRecords(client, 'test', records), /Upload failed/);
  assert.ok(!client.events.includes('delete'));
});
