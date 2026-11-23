import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { pageTitles, shareImagePath } from '../../constants/share-cards';
import { renderShareCard } from '../../../scripts/render-share-card.mjs';

export async function getStaticPaths() {
  const pages: [string, string][] = Object.entries(pageTitles);
  for (const { id, data } of await getCollection('blog', ({ data }) => !data.draft)) {
    const prefix = data.lang === 'zh' ? 'zh-tw' : 'en';
    pages.push([`/${prefix}/blog/${id.replace(/\.(zh|en)$/, '')}`, data.title]);
  }
  const paths = pages.map(([path, title]) => ({
    params: { card: shareImagePath(path, title).slice('/og/'.length, -'.png'.length) },
    props: { title, lang: path.startsWith('/en') ? 'en' : 'zh-tw' },
  }));
  // /slides is a standalone static document, outside the Astro layouts.
  paths.push({ params: { card: 'v1/slides' }, props: { title: 'Josh Wang — 面試簡報', lang: 'zh-tw' } });
  return paths;
}

export const GET: APIRoute = async ({ props }) => new Response(
  new Uint8Array(await renderShareCard(props)), { headers: { 'Content-Type': 'image/png' } },
);
