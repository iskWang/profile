import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { loadPosts, remarkBlogWikilinks } from './scripts/blog-content-rules.mjs';

let postMap;
function getPost(slug, lang) {
  if (!postMap) {
    const { posts } = loadPosts();
    postMap = new Map(posts.map((post) => [`${post.slug}.${post.lang}`, post]));
  }
  return postMap.get(`${slug}.${lang}`);
}

export default defineConfig({
  site: 'https://joshwang.dev',
  output: 'static',
  integrations: [
    react(),
    sitemap({
      i18n: {
        defaultLocale: 'zh-tw',
        locales: { 'zh-tw': 'zh-TW', en: 'en' },
      },
      customPages: ['https://joshwang.dev/slides'],
      serialize(item) {
        const match = item.url.match(/\/(zh-tw|en)\/blog\/([^/]+)\/?$/);
        if (match) {
          const [, locale, slug] = match;
          const lang = locale === 'zh-tw' ? 'zh' : 'en';
          const post = getPost(slug, lang);
          if (post) {
            const dateVal = post.data.updated || post.data.updatedDate || post.data.date || post.data.pubDate;
            if (dateVal) {
              item.lastmod = dateVal instanceof Date ? dateVal.toISOString() : new Date(`${dateVal}T00:00:00Z`).toISOString();
            }
          }
        }
        return item;
      },
    }),
  ],
  i18n: {
    locales: ['zh-tw', 'en'],
    defaultLocale: 'zh-tw',
    routing: { prefixDefaultLocale: true },
  },
  markdown: {
    shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' } },
    remarkPlugins: [remarkBlogWikilinks],
  },
});
