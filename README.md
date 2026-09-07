# Galen Blog

Live slowly, keep a record, and leave a little curiosity for tomorrow.

[中文配置指南](README.zh.md) · [GitHub](https://github.com/liuyoumi) · [Juejin](https://juejin.cn/user/167558220876360) · [Douyin](https://v.douyin.com/53pzh9MDf7E/)

A bilingual VitePress blog by Galen, an AI application developer in Chengdu.

## Development

Use Node.js 22.18+ and pnpm 11.

```sh
pnpm install
pnpm run docs:dev
pnpm run test
pnpm run docs:build
pnpm run docs:preview
```

Output: `docs/.vitepress/dist`. Public identity and service settings live in `docs/.vitepress/config/site.ts`.
Set the build environment variables `SITE_URL` (the real public root URL) and `GA_MEASUREMENT_ID` (your `G-…` ID) when available. No `.env` auto-loading is provided. With no URL, canonical/sitemap/RSS output stays disabled; with no GA ID, no analytics script is loaded.

Algolia uses the owner's `galen_blog` index and the original DocSearch UI. The **Sync search index** GitHub Actions workflow builds and syncs changed content on pushes to `main`, including removed articles. One-time setup: create an Algolia key restricted to `galen_blog` with `search`, `browse`, `addObject`, `deleteObject`, and `editSettings` permissions, save it as the repository secret `ALGOLIA_WRITE_API_KEY`, then run the workflow once. No per-article setup or domain is required. Indexing and website deployment are separate; publish the same `main` branch on your hosting provider.

`pnpm docs:build && pnpm search:check` validates the generated records locally without network writes. `pnpm search:sync` requires the write key in the environment. Normal builds never write to Algolia. Records use rendered HTML, heading anchors, and language filters; frontmatter `search: false` or `draft: true` excludes a page from search but does not prevent public access. The ignored intermediate file is stored outside the published output at `docs/.vitepress/cache/algolia-records.json`. Sync uploads changes before removing obsolete `galen:` records, preserves unrelated records, and refuses empty input. See the Chinese guide for setup and retry instructions.

Giscus uses `liuyoumi/galen-blog` / Announcements. AdSense is pending.

Two Juejin articles and their English translations are included. Notes and friends are currently empty. codex-history and Clipboard are real projects; One More Page and Run in Place are clearly labeled unreleased concepts.

The avatar and payment images were supplied by the owner. Paper illustrations were generated with Codex imagegen; prompts are in [design/galen-assets.md](design/galen-assets.md).

## Attribution and license

Customized from [Justin3go/justin3go.com](https://github.com/Justin3go/justin3go.com), preserving the original VitePress design and functionality. See the retained [LICENSE](LICENSE). Original personal content has been removed and replaced with Galen's information.
