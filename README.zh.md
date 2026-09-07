# Galen 的个人博客

慢慢生活，认真记录，留一点好奇给明天。

[English](README.md) · [GitHub](https://github.com/liuyoumi) · [抖音](https://v.douyin.com/53pzh9MDf7E/)

成都 · AI 应用开发工程师。这里记录项目、阅读和生活。

## 本地开发

需要 Node.js 22.18+ 和 pnpm 11。

```sh
pnpm install
pnpm run docs:dev
pnpm run test
pnpm run docs:build
pnpm run docs:preview
```

构建结果位于 `docs/.vitepress/dist`，可部署到支持静态文件的网站托管平台。

## 内容与配置

- `docs/.vitepress/config/site.ts`：昵称、邮箱、社交链接、Algolia 搜索和 Giscus 评论。
- `ProfileHome.vue`、`ProfileTimeline.vue`、`ProfileProjects.vue`：中英文生活介绍、经历、作品。
- `docs/posts` / `docs/en/posts`：中英文文章；`docs/notes` / `docs/en/notes`：笔记。目前为空，等待自己的内容。发布笔记时，在 `createSideBar.ts` 添加对应的目录项。
- `docs/friends.md` / `docs/en/friends.md`：友链页面，等待添加朋友。
- `docs/public/ava.png`：GitHub 头像，同时作为 favicon 和默认分享图片。
- `docs/public/payments`：用户提供的收款码；通过 SVG 图片视口只展示二维码及白边，原始 JPEG 字节保留。点击沿用原主题图片查看器，可放大、旋转及切换，文案为“请我喝杯咖啡”。
- `design/galen-assets.md`：原创纸片插画的生成提示词与场景映射。

真实作品：codex-history、Clipboard。读到这里、原地开跑是明确标注的构想，尚未发布。

## 上线前待补充

### 网站地址与 Google Analytics

在构建环境设置 `SITE_URL` 为实际公开网站根地址；可用托管平台提供的地址，不强制购买独立域名。
设置 `GA_MEASUREMENT_ID` 为自己的 `G-…` 衡量 ID，然后重新构建。

```sh
SITE_URL=https://your-site.example GA_MEASUREMENT_ID=G-YOURID pnpm run docs:build
```

上面只是格式示例，请替换。项目读取构建进程的环境变量，不自动加载 `.env`。
未提供网站地址时不生成 canonical、sitemap 和 RSS；提供后自动恢复。未提供 GA ID 时不加载统计脚本。

### Algolia

已配置自己的 Application ID、公开 Search API Key 和 `galen_blog` 索引。索引为空时不会有搜索结果。
部署并发布自己的文章后，需要配置爬虫/索引同步。当前前端使用 DocSearch，应导入兼容的 `hierarchy`、`content`、`url` 记录，并配置 `lang`、`tags` 筛选属性。
不要将 Write/Admin API Key 放进前端或仓库。索引写入密钥应留在 Algolia 或部署平台的 secrets 中。

### Giscus

评论连接 `liuyoumi/galen-blog` 的 Announcements 分类。需保持仓库公开、Discussions 开启，并授权 Giscus 应用。
中英文相同文章共享讨论；首页等设置 `isNoComment: true` 的页面隐藏评论。登录及首次发表评论请在部署后由站主验证。

### 广告与版本发布

AdSense 待申请；当前没有广告脚本或 ads.txt。获得自己的广告配置后再接入。
GitHub 版本发布工作流需要仓库配置 `RELEASE_TOKEN`，可手动触发；它不会部署网站。

## 来源与许可

基于 [Justin3go/justin3go.com](https://github.com/Justin3go/justin3go.com) 定制，保留原有 VitePress 主题设计与功能。原作者文章、笔记、个人作品和收款信息已移除。
沿用原仓库 [LICENSE](LICENSE) 中的许可条款和声明。品牌与个人资料现属于 Galen。
