import { readFile } from 'node:fs/promises';
import { algoliasearch } from 'algoliasearch';
import { syncRecords, validateRecords } from './algolia-records.mjs';

const dryRun = process.argv.includes('--dry-run');
try {
  const { version, appId, indexName, records } = JSON.parse(await readFile(
    new URL('../docs/.vitepress/cache/algolia-records.json', import.meta.url), 'utf8',
  ));
  if (version !== 1 || !appId || !indexName) throw new Error('Invalid search artifact; rebuild the site first.');
  validateRecords(records);
  if (dryRun) {
    console.log(JSON.stringify({ indexName, records: records.length, pages: new Set(records.map((r) => r.url_without_anchor)).size, languages: [...new Set(records.map((r) => r.lang))] }, null, 2));
  } else {
    const key = process.env.ALGOLIA_WRITE_API_KEY?.trim();
    if (!key) throw new Error('Missing ALGOLIA_WRITE_API_KEY. Add it to GitHub Actions repository secrets.');
    const client = algoliasearch(appId, key);
    const result = await syncRecords(client, indexName, records);
    console.log(`Algolia ${indexName}: saved ${result.saved}, removed ${result.removed}, total ${result.total}.`);
  }
} catch (error) {
  // Do not print SDK request objects: they may include authentication headers.
  const message = String(error.message || 'Unknown error');
  const key = process.env.ALGOLIA_WRITE_API_KEY;
  console.error(key ? message.replaceAll(key, '[REDACTED]') : message);
  process.exitCode = 1;
}
