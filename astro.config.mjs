import { defineConfig } from 'astro/config';
import fs from 'node:fs/promises';
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
  trailingSlash: 'never',
  integrations: [
    react(),
    sitemap({
      filter: (page) => new URL(page).pathname !== '/',
      i18n: {
        defaultLocale: 'zh-tw',
        locales: { 'zh-tw': 'zh-TW', en: 'en' },
      },
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
    {
      name: 'flatten-sitemap',
      hooks: {
        'astro:build:done': async ({ dir, logger }) => {
          const sitemap0 = new URL('sitemap-0.xml', dir);
          const sitemapIndex = new URL('sitemap-index.xml', dir);
          const sitemapTarget = new URL('sitemap.xml', dir);
          try {
            await fs.copyFile(sitemap0, sitemapTarget);
            await fs.unlink(sitemap0);
            await fs.unlink(sitemapIndex);
            logger.info('`sitemap.xml` created at `dist` (flattened from sitemap-0.xml)');
          } catch (err) {
            logger.error(`Failed to flatten sitemap: ${err.message}`);
          }
        },
      },
    },
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
