import { type DefaultTheme, defineConfig } from 'vitepress'
import { site } from './site'
import { juejinIcon } from './icons'
import { siteUrl } from './deployment'
import { createSideBarEN } from '../theme/utils/createSideBar'

export default defineConfig({
  title: site.name,
  description: site.description.en,
  lang: 'en-US',
  themeConfig: {
    sidebar: createSideBarEN(),
    nav: [{"text": "Home", "link": "/en/", "activeMatch": "^\\/en\\/(?:\\?.*)?$"}, {"text": "Blog", "link": "/en/blog", "activeMatch": "^\\/en\\/blog(?:\\?.*)?$"}, {"text": "Archive", "link": "/en/archive", "activeMatch": "^\\/en\\/archive(?:\\?.*)?$"}, {"text": "Sponsor", "link": "/en/support-me", "activeMatch": "^\\/en\\/support-me(?:\\?.*)?$"}],
    footer: {
      message: `Copyright © ${site.copyrightStart}–present <a href="/en/">${site.name}</a>. &nbsp; <a href="/en/#projects">Projects</a> · <a href="/en/#contact">Contact</a> · <a href="/en/friends">Friends</a>`,
    },
    socialLinks: [
      { icon: 'github', link: site.github },
      { icon: { svg: juejinIcon }, link: site.juejin, ariaLabel: 'Juejin profile' },
      { icon: { svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M16 2h-4v13a3 3 0 1 1-3-3v-4a7 7 0 1 0 7 7V8a9 9 0 0 0 5 2V6a5 5 0 0 1-5-4Z"/></svg>' }, link: site.douyin, ariaLabel: 'Douyin' },
      ...(siteUrl ? [{ icon: { svg: '<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><title>RSS</title><path d="M108.56,342.78a60.34,60.34,0,1,0,60.56,60.44A60.63,60.63,0,0,0,108.56,342.78Z"/><path d="M48,186.67v86.55c52,0,101.94,15.39,138.67,52.11s52,86.56,52,138.67h86.66C325.33,312.44,199.67,186.67,48,186.67Z"/><path d="M48,48v86.56c185.25,0,329.22,144.08,329.22,329.44H464C464,234.66,277.67,48,48,48Z"/></svg>' }, link: '/feed-en.xml' }] : []),
    ],

  },
})
