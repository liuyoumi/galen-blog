# Galen 的个人博客

慢慢生活，认真记录，留一点好奇给明天。

[English](README.md) · [GitHub](https://github.com/liuyoumi) · [掘金](https://juejin.cn/user/167558220876360) · [抖音](https://v.douyin.com/53pzh9MDf7E/)

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
- `docs/posts` / `docs/en/posts`：中英文文章；`docs/notes` / `docs/en/notes`：笔记。已导入两篇掘金文章及英文译文，笔记目前为空。发布笔记时，在 `createSideBar.ts` 添加对应的目录项。
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

搜索界面沿用 Algolia DocSearch，公开配置在 `site.ts`，索引为 `galen_blog`。`.github/workflows/search.yml` 在 `main` 上的文章、主题或索引脚本变更推送后自动构建并同步，也支持在 Actions 中手动运行 **Sync search index**。

只需配置一次写入权限：

1. 在 Algolia 的 **Settings → API Keys** 新建专用 Key。Indices 限制为 `galen_blog`；ACL 勾选 `search`、`browse`、`addObject`、`deleteObject`、`editSettings`。不要添加 HTTP Referrers 限制，GitHub Actions 不会发送浏览器来源。
2. 在 [GitHub 仓库 Secrets](https://github.com/liuyoumi/galen-blog/settings/secrets/actions) 添加 Repository secret：名称 `ALGOLIA_WRITE_API_KEY`，值为该 Key。不要把写入 Key 写进代码、前端或 `.env` 提交到仓库。
3. 首次添加 Secret 后，在 [Actions](https://github.com/liuyoumi/galen-blog/actions/workflows/search.yml) 选择 **Sync search index → Run workflow → main**。成功后文章即可被搜索。

此后正常新增、修改或删除 Markdown 并推送 `main` 即可，不需要逐篇配置。它同步 GitHub 上的内容，不负责部署网页；网站上线后请将 `main` 同时作为托管平台的发布分支，避免索引先于网页更新。

构建从生成的 HTML 提取正文、标题和真实锚点，生成 DocSearch 记录，按 `zh-Hans` / `en-US` 筛选。支持相对链接，无需先购买域名。设置文章 frontmatter `search: false` 或 `draft: true` 可不加入索引（这不会阻止页面被构建或公开访问）。

```sh
pnpm docs:build
pnpm search:check # 本地校验索引，不访问 Algolia
# 仅在已通过环境变量提供专用写入 Key 时手动同步：
pnpm search:sync
```

中间文件位于已忽略的 `docs/.vitepress/cache/algolia-records.json`，不随网页发布。普通构建不会写入 Algolia。同步只上传变化的记录，等上传成功后再删除过时的 `galen:` 记录；不会清空索引或删除其他工具的记录。构建、校验或上传失败会使工作流失败，修复后重新运行即可；空索引产物会拒绝同步，防止意外清空数据。

原项目在仓库中仅配置了 Algolia 搜索端，没有提交爬虫配置或索引同步工作流，无法据此确认原作者后台的抓取计划。本项目使用上述 GitHub Actions 直接同步，不需要另外配置爬虫。

### Giscus

评论连接 `liuyoumi/galen-blog` 的 Announcements 分类。需保持仓库公开、Discussions 开启，并授权 Giscus 应用。
中英文相同文章共享讨论；首页等设置 `isNoComment: true` 的页面隐藏评论。登录及首次发表评论请在部署后由站主验证。

### 广告与版本发布

AdSense 待申请；当前没有广告脚本或 ads.txt。获得自己的广告配置后再接入。
GitHub 版本发布工作流需要仓库配置 `RELEASE_TOKEN`，可手动触发；它不会部署网站。

## 来源与许可

基于 [Justin3go/justin3go.com](https://github.com/Justin3go/justin3go.com) 定制，保留原有 VitePress 主题设计与功能。原作者文章、笔记、个人作品和收款信息已移除。
沿用原仓库 [LICENSE](LICENSE) 中的许可条款和声明。品牌与个人资料现属于 Galen。
