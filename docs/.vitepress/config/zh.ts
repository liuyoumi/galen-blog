import { type DefaultTheme, defineConfig } from 'vitepress'
import { site } from './site'
import { siteUrl } from './deployment'
import { createSideBarZH } from '../theme/utils/createSideBar'

export default defineConfig({
  title: site.name,
  description: site.description.zh,
  lang: 'zh-Hans',
  themeConfig: {
    sidebar: createSideBarZH(),
    nav: [{"text": "首页", "link": "/", "activeMatch": "^\\/(?:\\?.*)?$"}, {"text": "博客", "link": "/blog", "activeMatch": "^\\/blog(?:\\?.*)?$"}, {"text": "归档", "link": "/archive", "activeMatch": "^\\/archive(?:\\?.*)?$"}, {"text": "赞助", "link": "/support-me", "activeMatch": "^\\/support-me(?:\\?.*)?$"}],
    footer: {
      message: `Copyright © ${site.copyrightStart}–present <a href="/">${site.name}</a>. &nbsp; <a href="/#projects">个人作品</a> · <a href="/#contact">联系方式</a> · <a href="/friends">友情链接</a>`,
    },
    socialLinks: [
      { icon: 'github', link: site.github },
      { icon: { svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M16 2h-4v13a3 3 0 1 1-3-3v-4a7 7 0 1 0 7 7V8a9 9 0 0 0 5 2V6a5 5 0 0 1-5-4Z"/></svg>' }, link: site.douyin, ariaLabel: 'Douyin' },
      ...(siteUrl ? [{ icon: { svg: '<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><title>RSS</title><path d="M108.56,342.78a60.34,60.34,0,1,0,60.56,60.44A60.63,60.63,0,0,0,108.56,342.78Z"/><path d="M48,186.67v86.55c52,0,101.94,15.39,138.67,52.11s52,86.56,52,138.67h86.66C325.33,312.44,199.67,186.67,48,186.67Z"/><path d="M48,48v86.56c185.25,0,329.22,144.08,329.22,329.44H464C464,234.66,277.67,48,48,48Z"/></svg>' }, link: '/feed.xml' }] : []),
    ],
    docFooter: { prev: '上一篇', next: '下一篇' },
    outlineTitle: '当前页面',
    lastUpdatedText: '最近更新时间',
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '目录',
    darkModeSwitchLabel: '深色模式',
  },
})

export const search: DefaultTheme.AlgoliaSearchOptions['locales'] = {
  root: {
    placeholder: '搜索文档',
    translations: {
      button: {
        buttonText: '搜索文档',
        buttonAriaLabel: '搜索文档'
      },
      modal: {
        searchBox: {
          resetButtonTitle: '清除查询条件',
          resetButtonAriaLabel: '清除查询条件',
          cancelButtonText: '取消',
          cancelButtonAriaLabel: '取消'
        },
        startScreen: {
          recentSearchesTitle: '搜索历史',
          noRecentSearchesText: '没有搜索历史',
          saveRecentSearchButtonTitle: '保存至搜索历史',
          removeRecentSearchButtonTitle: '从搜索历史中移除',
          favoriteSearchesTitle: '收藏',
          removeFavoriteSearchButtonTitle: '从收藏中移除'
        },
        errorScreen: {
          titleText: '无法获取结果',
          helpText: '你可能需要检查你的网络连接'
        },
        footer: {
          selectText: '选择',
          navigateText: '切换',
          closeText: '关闭',
          searchByText: '搜索提供者'
        },
        noResultsScreen: {
          noResultsText: '无法找到相关结果',
          suggestedQueryText: '你可以尝试查询',
          reportMissingResultsText: '你认为该查询应该有结果？',
          reportMissingResultsLinkText: '点击反馈'
        }
      }
    }
  }
}
