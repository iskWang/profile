import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = (await getCollection('blog', ({ data }) => data.lang === 'en' && !data.draft))
    .sort((a, b) => b.data.date.localeCompare(a.data.date));

  return rss({
    title: 'Josh Wang — Blog',
    description: "Josh Wang's blog about writing, tools, and continuous learning.",
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: new Date(post.data.date),
      description: post.data.summary,
      link: `/en/blog/${post.id.replace(/\.(?:zh|en)$/, '')}`,
    })),
  });
}
