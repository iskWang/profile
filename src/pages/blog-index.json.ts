import { getCollection } from 'astro:content';

export async function GET() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  const items = posts.map(post => {
    const slug = post.id.replace(/\.(?:zh|en)$/, '');
    const prefix = post.data.lang === 'zh' ? 'zh-tw' : 'en';
    return {
      lang: prefix,
      slug,
      url: `https://joshwang.dev/${prefix}/blog/${slug}`,
      title: post.data.title,
      date: post.data.date,
      updated: post.data.updated ?? null,
      summary: post.data.summary,
      topics: post.data.topics,
    };
  }).sort((a, b) => b.date.localeCompare(a.date));
  return new Response(JSON.stringify(items), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
