import { getCollection } from 'astro:content';

export async function GET() {
  const published = (await getCollection('blog', ({ data }) => data.lang === 'en' && !data.draft))
    .sort((a, b) => b.data.date.localeCompare(a.data.date));
  const lines = [
    '# Blog — Josh Wang',
    '',
    "Josh Wang's blog about writing, tools, and continuous learning",
    '',
    'RSS: https://joshwang.dev/en/blog/rss.xml',
    '',
    ...published.map(post => `- [${post.data.title}](https://joshwang.dev/en/blog/${post.id.replace(/\.en$/, '')}) (${post.data.date}) — ${post.data.summary}`),
  ];
  return new Response(`${lines.join('\n')}\n`, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
}
