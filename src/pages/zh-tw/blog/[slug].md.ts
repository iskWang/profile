import { getCollection } from 'astro:content';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import type { Root, RootContent } from 'mdast';

const site = 'https://joshwang.dev';

function rewriteWikilinks(body: string, bySlugOrTitle: Map<string, string>) {
  const tree = unified().use(remarkParse).parse(body);
  const edits: Array<[number, number, string]> = [];
  function visit(node: Root | RootContent) {
    if (['code', 'inlineCode', 'link', 'linkReference'].includes(node.type) || !('children' in node)) return;
    for (const child of node.children) {
      if (child.type === 'text' && child.value.includes('[[')) {
        const offset = child.position?.start.offset;
        const end = child.position?.end.offset;
        if (offset === undefined || end === undefined) throw new Error('Missing Markdown source position');
        const source = body.slice(offset, end);
        for (const match of source.matchAll(/(?<!\\)((?:\\\\)*)\[\[([^\]\n]+)\]\]/g)) {
          const parsed = unified().use(remarkParse).parse(match[0].slice(match[1].length)).children[0];
          const text = parsed?.type === 'paragraph' && parsed.children[0]?.type === 'text' ? parsed.children[0].value : undefined;
          if (!text) throw new Error('Invalid wikilink text');
          const inner = text.slice(2, -2);
          const separator = inner.indexOf('|');
          const target = (separator < 0 ? inner : inner.slice(0, separator)).trim();
          const label = separator < 0 ? target : inner.slice(separator + 1);
          const resolvedSlug = bySlugOrTitle.get(target);
          if (!resolvedSlug) throw new Error(`Unresolved wikilink: [[${target}]] (zh)`);
          const start = offset + (match.index ?? 0) + match[1].length;
          edits.push([start, start + match[0].length - match[1].length, `[${label}](${site}/zh-tw/blog/${resolvedSlug})`]);
        }
      } else visit(child);
    }
  }
  visit(tree);
  for (const [start, end, replacement] of edits.reverse()) body = body.slice(0, start) + replacement + body.slice(end);
  return body;
}

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => data.lang === 'zh' && !data.draft);
  return posts.map(post => ({ params: { slug: post.id.replace(/\.zh$/, '') }, props: { post } }));
}

export async function GET({ props: { post } }) {
  const posts = await getCollection('blog', ({ data }) => data.lang === 'zh' && !data.draft);
  const bySlugOrTitle = new Map<string, string>();
  for (const item of posts) {
    const s = item.id.replace(/\.zh$/, '');
    bySlugOrTitle.set(s, s);
    bySlugOrTitle.set(item.data.title, s);
  }
  const slug = post.id.replace(/\.zh$/, '');
  const canonical = `${site}/zh-tw/blog/${slug}`;
  const metadata = [`Published: ${post.data.date}`, ...(post.data.updated ? [`Updated: ${post.data.updated}`] : []), `Topics: ${post.data.topics.join(', ')}`, `Canonical: ${canonical}`];
  const body = `# ${post.data.title}\n\n${metadata.join(' · ')}\n\n${post.data.summary}\n\n${rewriteWikilinks(post.body ?? '', bySlugOrTitle).trim()}\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
}
