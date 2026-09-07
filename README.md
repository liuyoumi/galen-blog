# Galen Blog

Live slowly, keep a record, and leave a little curiosity for tomorrow.

[中文配置指南](README.zh.md) · [GitHub](https://github.com/liuyoumi) · [Douyin](https://v.douyin.com/53pzh9MDf7E/)

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

Algolia uses the owner's `galen_blog` index, which still needs a DocSearch-compatible crawl after deployment and publishing. Giscus uses `liuyoumi/galen-blog` / Announcements. AdSense is pending. See the Chinese guide for the complete setup checklist.

Articles, notes, and friends start empty. codex-history and Clipboard are real projects; One More Page and Run in Place are clearly labeled unreleased concepts.

The avatar and payment images were supplied by the owner. Paper illustrations were generated with Codex imagegen; prompts are in [design/galen-assets.md](design/galen-assets.md).

## Attribution and license

Customized from [Justin3go/justin3go.com](https://github.com/Justin3go/justin3go.com), preserving the original VitePress design and functionality. See the retained [LICENSE](LICENSE). Original personal content has been removed and replaced with Galen's information.
