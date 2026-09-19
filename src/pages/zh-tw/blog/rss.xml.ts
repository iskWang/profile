import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';


export async function GET(context) {
  const posts = (await getCollection('blog', ({ data }) => data.lang === 'zh' && !data.draft))
    .sort((a, b) => b.data.date.localeCompare(a.data.date));

  return rss({
    title: 'Josh Wang — 部落格',
    description: 'Josh Wang 的繁體中文部落格文章。',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: new Date(post.data.date),
      description: post.data.summary,
      link: `/zh-tw/blog/${post.id.replace(/\.(?:zh|en)$/, '')}`,
    })),
  });
}
