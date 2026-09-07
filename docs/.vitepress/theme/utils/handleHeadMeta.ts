import { type HeadConfig, type TransformContext } from 'vitepress';
import { site } from '../../config/site';
import { siteUrl } from '../../config/deployment';

export function handleHeadMeta(context: TransformContext): HeadConfig[] {
  const { description, title, relativePath, frontmatter } = context.pageData;
  const curDesc = description || context.description;
  const head: HeadConfig[] = [
    ['meta', { property: 'og:site_name', content: site.name }],
    ['meta', { property: 'og:title', content: title || site.name }],
    ['meta', { property: 'og:description', content: curDesc }],
    ['meta', { name: 'twitter:card', content: frontmatter.cover ? 'summary_large_image' : 'summary' }],
    ['meta', { name: 'twitter:description', content: curDesc }],
  ];
  // Absolute canonical, social-image and RSS URLs wait for a real website URL.
  if (siteUrl) {
    const url = addBase(relativePath);
    const cover = new URL(frontmatter.cover || site.avatar, `${siteUrl}/`).href;
    head.push(
      ['link', { rel: 'canonical', href: url }],
      ['meta', { property: 'og:url', content: url }],
      ['meta', { property: 'og:image', content: cover }],
      ['meta', { name: 'twitter:image', content: cover }],
      ['link', { rel: 'alternate', type: 'application/rss+xml', title: `${site.name} RSS`, href: `${siteUrl}/${relativePath.startsWith('en/') ? 'feed-en.xml' : 'feed.xml'}` }],
    );
  }
  return head;
}

export function addBase(relativePath: string): string {
  const route = relativePath
    .replace(/^\//, '')
    .replace(/(^|\/)(index|about)\.md$/, '$1')
    .replace(/\.md$/, '');
  return `${siteUrl}/${route.split('/').map(encodeURIComponent).join('/')}`;
}
