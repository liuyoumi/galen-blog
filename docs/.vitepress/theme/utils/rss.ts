import path from 'node:path';
import { writeFileSync, rmSync } from 'node:fs';
import { Feed } from 'feed';
import { createContentLoader, type SiteConfig } from 'vitepress';
import { site } from '../../config/site';
import { siteUrl } from '../../config/deployment';

async function createRss(config: SiteConfig, locale: 'zh' | 'en') {
  const filename = locale === 'zh' ? 'feed.xml' : 'feed-en.xml';
  if (!siteUrl) {
    rmSync(path.join(config.outDir, filename), { force: true });
    return;
  }
  const feed = new Feed({
    title: site.name,
    description: site.description[locale],
    id: `${siteUrl}/${filename}`,
    link: `${siteUrl}${locale === 'zh' ? '/' : '/en/'}`,
    language: locale === 'zh' ? 'zh-Hans' : 'en-US',
    image: `${siteUrl}${site.avatar}`,
    favicon: `${siteUrl}${site.avatar}`,
    copyright: `Copyright © ${site.copyrightStart}–present ${site.name}`,
  });
  const posts = await createContentLoader(locale === 'zh' ? 'posts/**/*.md' : 'en/posts/**/*.md', {
    excerpt: true,
    render: true,
  }).load();
  posts.sort((a, b) => +new Date(b.frontmatter.date) - +new Date(a.frontmatter.date));
  for (const { url, excerpt, html, frontmatter } of posts.slice(0, 5)) {
    feed.addItem({
      title: frontmatter.title,
      id: `${siteUrl}${url}`,
      link: `${siteUrl}${url}`,
      description: excerpt,
      content: html,
      author: [{ name: site.name, email: site.email, link: siteUrl }],
      date: new Date(frontmatter.date),
    });
  }
  writeFileSync(path.join(config.outDir, filename), feed.rss2(), 'utf8');
}

export const createRssFileZH = (config: SiteConfig) => createRss(config, 'zh');
export const createRssFileEN = (config: SiteConfig) => createRss(config, 'en');
