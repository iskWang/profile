import { getCollection } from 'astro:content';

export async function GET() {
  const published = (await getCollection('blog', ({ data }) => data.lang === 'zh' && !data.draft))
    .sort((a, b) => b.data.date.localeCompare(a.data.date));
  const lines = [
    '# 部落格 — Josh Wang',
    '',
    'Josh Wang 的繁體中文部落格文章',
    '',
    'RSS: https://joshwang.dev/zh-tw/blog/rss.xml',
    '',
    ...published.map(post => `- [${post.data.title}](https://joshwang.dev/zh-tw/blog/${post.id.replace(/\.zh$/, '')}) (${post.data.date}) — ${post.data.summary}`),
  ];
  return new Response(`${lines.join('\n')}\n`, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
}
