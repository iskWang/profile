import rss from '@astrojs/rss';
import { getPublishedPosts, postSlug, postUrl } from './blog.js';
import { UI } from '../i18n/ui.js';

/** RSS feed for one content language ('zh' | 'en'). */
export async function blogRss(lang, context) {
  const posts = await getPublishedPosts(lang);
  return rss({
    title: UI[lang].rss.title,
    description: UI[lang].rss.description,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: new Date(post.data.date),
      description: post.data.summary,
      link: postUrl(lang, postSlug(post)),
    })),
  });
}
