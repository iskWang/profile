import { getCollection } from 'astro:content';
import { localePath, otherLang } from '../i18n/locales.js';

// Newest first; same-day posts by id so the order never depends on loader order.
const byDateDesc = (a, b) => b.data.date.localeCompare(a.data.date) || a.id.localeCompare(b.id);

/** Published (non-draft) posts in one language, newest first. */
export async function getPublishedPosts(lang) {
  return (await getCollection('blog', ({ data }) => data.lang === lang && !data.draft)).sort(byDateDesc);
}

export function postSlug(entry) {
  return entry.id.replace(/\.(?:zh|en)$/, '');
}

export function postUrl(lang, slug) {
  return localePath(lang, `blog/${slug}`);
}

/**
 * Attachment letters (A, B, C…) in order of publication, so a post keeps its
 * letter when newer posts arrive. Same-day posts are lettered opposite to their
 * display order (byDateDesc), so letters always descend down a newest-first list.
 */
export function attachmentCodes(posts) {
  const chronological = [...posts].sort((a, b) => a.data.date.localeCompare(b.data.date) || b.id.localeCompare(a.id));
  return new Map(chronological.map((post, index) => [post.id, String.fromCharCode(65 + index)]));
}

/** Up to `limit` other posts, most shared topics first, then newest. */
export async function relatedPosts(post, limit = 3) {
  const posts = await getPublishedPosts(post.data.lang);
  return posts
    .filter((candidate) => candidate.id !== post.id)
    .map((candidate) => ({
      candidate,
      shared: candidate.data.topics.filter((topic) => post.data.topics.includes(topic)).length,
    }))
    .sort((a, b) => b.shared - a.shared || byDateDesc(a.candidate, b.candidate))
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}

/** The published translation of `post`, or null. */
export async function counterpartOf(post) {
  const slug = postSlug(post);
  const posts = await getPublishedPosts(otherLang(post.data.lang));
  return posts.find((entry) => postSlug(entry) === slug) ?? null;
}

export function topicsOf(posts) {
  return [...new Set(posts.flatMap((post) => post.data.topics))].sort();
}

export async function blogStaticPaths(lang) {
  const posts = await getPublishedPosts(lang);
  return posts.map((entry) => ({ params: { slug: postSlug(entry) }, props: { post: entry } }));
}
