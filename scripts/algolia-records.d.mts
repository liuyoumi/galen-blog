import type { algoliasearch } from 'algoliasearch';

export interface SearchRecord {
  objectID: string;
  url: string;
  url_without_anchor: string;
  anchor: string;
  hierarchy: Record<string, string | null>;
  content: string | null;
  type: string;
  lang: string;
  tags: string[];
  weight: { level: number; position: number };
  recordHash: string;
}

export const RECORD_PREFIX: string;
export const indexSettings: Record<string, unknown>;
export function extractRecords(html: string, pageUrl: string, frontmatter?: Record<string, unknown>): SearchRecord[];
export function validateRecords(records: unknown): asserts records is SearchRecord[];
export function planSync(records: SearchRecord[], previous: { objectID: string; recordHash?: string }[]): {
  save: SearchRecord[];
  remove: string[];
};
export function syncRecords(client: ReturnType<typeof algoliasearch>, indexName: string, records: SearchRecord[]): Promise<{
  saved: number;
  removed: number;
  total: number;
}>;
