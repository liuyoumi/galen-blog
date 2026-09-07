import { defineConfig, type SiteConfig } from 'vitepress'
// 自动导入 TDesign 
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { TDesignResolver } from 'unplugin-vue-components/resolvers';

import { createRssFileZH, createRssFileEN } from "../theme/utils/rss";
import { handleHeadMeta } from "../theme/utils/handleHeadMeta";
import { search as zhSearch } from './zh'
import { site } from './site'
import { siteUrl, gaMeasurementId } from './deployment'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lastUpdated: true,
  cleanUrls: true,
  ignoreDeadLinks: false,
  ...(siteUrl ? { sitemap: { hostname: siteUrl } } : {}),
  head: [
    ...(gaMeasurementId ? [
    ["script", { async: "", src: `https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}` }],
    [
      "script",
      {},
      `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${gaMeasurementId}');`,
    ],
    ] as import('vitepress').HeadConfig[] : []),
    [
      "link",
      {
        rel: "icon",
        href: site.avatar,
        type: 'image/png',
      },
    ],
  ],
  // https://vitepress.dev/reference/site-config#transformhead
  async transformHead(context) {
    return handleHeadMeta(context)
  },
  buildEnd: async (config: SiteConfig) => {
    await Promise.all([createRssFileZH(config), createRssFileEN(config)]);
  },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    outline: [2, 4],

    // 本地搜索
    // search: {
    //   provider: "local",
    //   options: {
    //     locales: { ...zhSearch }
    //   }
    // },

    // algolia搜索，需要申请，如不需要，删除下面的配置，可使用本地搜索
    search: {
      provider: 'algolia',
      options: {
        ...site.algolia,
        locales: { ...zhSearch }
      }
    },

    externalLinkIcon: true,
  },

  markdown: {
    math: true
  },

  vite: {
    plugins: [
      // ...
      AutoImport({
        resolvers: [TDesignResolver({
          library: 'vue-next'
        })],
      }),
      Components({
        resolvers: [TDesignResolver({
          library: 'vue-next'
        })],
      }),
    ],
    ssr: {
      noExternal: ['tdesign-vue-next', 'tdesign-icons-vue-next']
    }
  },
})
