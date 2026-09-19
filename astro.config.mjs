import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { remarkBlogWikilinks } from './scripts/blog-content-rules.mjs';

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
