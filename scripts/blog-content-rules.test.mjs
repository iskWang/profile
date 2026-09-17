import { describe, expect, test } from 'bun:test';
import { buildIndex, loadPosts, validatePost, resolveWikilinks, remarkBlogWikilinks } from './blog-content-rules.mjs';
import { unified } from 'unified';
import remarkParse from 'remark-parse';

const { posts, errors } = loadPosts();
if (errors.length) throw new Error(errors.join('\n'));
const zh = posts.find(post => post.data.lang === 'zh');
const en = posts.find(post => post.data.lang === 'en');
const index = buildIndex(posts);
const change = (data = {}, body = zh.body, file = zh.path) => ({ ...zh, path: file, data: { ...zh.data, ...data }, body });

describe('blog semantic and security gates', () => {
  test('real published fixtures validate and retain both locale URLs', () => {
    for (const post of posts) validatePost(post, index);
    expect(resolveWikilinks('<p>[[hello-blog]]</p>', index, 'zh')).toBe('<p><a href="/zh-tw/blog/hello-blog">hello-blog</a></p>');
    expect(resolveWikilinks('<p>[[hello-blog]]</p>', index, 'en')).toBe('<p><a href="/en/blog/hello-blog">hello-blog</a></p>');
  });
  test('vault blacklist rejects private areas', () => {
    expect(() => validatePost(change({ vault_path: '10_Areas/example-topic/x.md' }), index)).toThrow('blacklist');
  });
  test('vault traversal cannot escape permitted resources', () => {
    expect(() => validatePost(change({ vault_path: '30_Resources/../10_Areas/example-topic/x.md' }), index)).toThrow('escape');
  });
  test('vault whitelist must start at the first segment', () => {
    expect(() => validatePost(change({ vault_path: 'other/30_Resources/x.md' }), index)).toThrow('must start');
    validatePost(change({ vault_path: '30_Resources/example-topic/x.md' }), index);
  });
  test('adapted source pairing is required only for adapted work', () => {
    expect(() => validatePost(change({ origin: 'adapted' }), index)).toThrow('requires source');
    expect(() => validatePost(change({ origin: 'adapted', source: 'https://example.com' }), index)).toThrow('requires source_title');
    validatePost(change({ origin: 'adapted', source: 'https://example.com', source_title: 'Source' }), index);
    expect(() => validatePost(change({ source: 'https://example.com', source_title: 'Source' }), index)).toThrow('only allowed');
  });
  test('topics cannot be empty', () => {
    expect(() => validatePost(change({ topics: [] }), index)).toThrow('topics');
  });
  test('topics must be kebab-case', () => {
    expect(() => validatePost(change({ topics: ['Not Kebab'] }), index)).toThrow('kebab-case');
  });
  test('reserved slugs cannot become public routes', () => {
    expect(() => validatePost(change({}, zh.body, 'content/blog/rss.zh.md'), index)).toThrow('reserved slug');
  });
  test('language must match the actual filename suffix', () => {
    expect(() => validatePost(change({ lang: 'en' }), index)).toThrow('lang must match');
  });
  test('translation marker is English-only', () => {
    expect(() => validatePost(change({ translation: 'machine-assisted' }), index)).toThrow('only allowed on lang: en');
    validatePost(en, index);
  });
  test('unresolved and wrong-language wikilinks fail', () => {
    expect(() => validatePost(change({}, '[[missing]]'), index)).toThrow('unresolved wikilink');
    expect(() => validatePost(change({}, `[[${en.data.title}]]`), index)).toThrow('unresolved wikilink');
  });
  test('wikilinks resolve exact titles and safely encode display labels', () => {
    expect(resolveWikilinks(`<p>[[${zh.data.title}|文字]]</p>`, index, 'zh')).toBe('<p><a href="/zh-tw/blog/hello-blog">文字</a></p>');
    expect(resolveWikilinks('<p>[[hello-blog|&lt;img src=x&gt;]]</p>', index, 'zh')).toBe('<p><a href="/zh-tw/blog/hello-blog">&lt;img src=x&gt;</a></p>');
  });
  test('fenced and inline code neither reject nor rewrite example links', () => {
    const body = '```md\n[[missing]]\n![[embed]]\n```\n\n`[[missing]]`';
    validatePost(change({}, body), index);
    const parser = unified().use(remarkParse);
    const tree = parser.parse(body);
    const before = structuredClone(tree);
    remarkBlogWikilinks()(tree, { path: `${process.cwd()}/${zh.path}` });
    expect(tree).toEqual(before);
    expect(resolveWikilinks('<pre><code>[[missing]]</code></pre><code>[[missing]]</code>', index, 'zh')).toBe('<pre><code>[[missing]]</code></pre><code>[[missing]]</code>');
  });
  test('Obsidian embeds reject publishing', () => {
    expect(() => validatePost(change({}, '![[hello-blog]]'), index)).toThrow('Obsidian embed');
  });
  test('raw HTML blocks are validated for wikilinks and embeds, not just images', () => {
    expect(() => validatePost(change({}, '<div>[[missing]]</div>'), index)).toThrow('unresolved wikilink');
    expect(() => validatePost(change({}, '<div>![[hello-blog]]</div>'), index)).toThrow('Obsidian embed');
    validatePost(change({}, '<div>[[hello-blog]]</div>'), index);
  });
  test('raw HTML code/pre blocks stay exempt from wikilink validation', () => {
    validatePost(change({}, '<pre><code>[[missing]]</code></pre>'), index);
  });
  test('remark compile rewrites wikilinks inside raw HTML blocks into real links', () => {
    const parser = unified().use(remarkParse);
    const tree = parser.parse('<div>See [[hello-blog]] for details.</div>');
    remarkBlogWikilinks()(tree, { path: `${process.cwd()}/${zh.path}` });
    expect(tree.children[0].value).toBe('<div>See <a href="/zh-tw/blog/hello-blog">hello-blog</a> for details.</div>');
  });
  test('remark compile still rejects unresolved wikilinks and embeds inside raw HTML blocks', () => {
    const parser = unified().use(remarkParse);
    expect(() => remarkBlogWikilinks()(parser.parse('<div>[[missing]]</div>'), { path: `${process.cwd()}/${zh.path}` })).toThrow('unresolved wikilink');
    expect(() => remarkBlogWikilinks()(parser.parse('<div>![[hello-blog]]</div>'), { path: `${process.cwd()}/${zh.path}` })).toThrow('Obsidian embed');
  });
  test('images require meaningful alternative text', () => {
    expect(() => validatePost(change({}, '![](/blog/assets/hello-blog/x.png)'), index)).toThrow('alt');
    expect(() => validatePost(change({}, '<img src="/blog/assets/hello-blog/x.png" alt=" ">'), index)).toThrow('alt');
  });
  test('images must stay under their own slug and exist', () => {
    expect(() => validatePost(change({}, '![Example](/other/x.png)'), index)).toThrow('must stay under');
    expect(() => validatePost(change({}, '![Example](/blog/assets/hello-blog/%2e%2e/private.png)'), index)).toThrow('must stay under');
    expect(() => validatePost(change({}, '![Example](/blog/assets/hello-blog/missing.png)'), index)).toThrow('does not exist');
  });
  test('frontmatter owns the initial title', () => {
    expect(() => validatePost(change({}, '\n# Repeated title'), index)).toThrow('body must not start');
  });
  test('drafts disappear from public index and cannot be linked', () => {
    const draftIndex = buildIndex([change({ draft: true }), en]);
    expect(draftIndex.posts).toEqual([en]);
    expect(() => resolveWikilinks('<p>[[hello-blog]]</p>', draftIndex, 'zh')).toThrow('unresolved wikilink');
    expect(resolveWikilinks('<p>[[hello-blog]]</p>', draftIndex, 'en')).toContain('/en/blog/hello-blog');
  });
  test('remark wikilinks do not promote escaped surrounding text into HTML', () => {
    const parser = unified().use(remarkParse);
    const tree = parser.parse('&lt;img src=x onerror=alert(1)&gt; [[hello-blog|safe]] &amp; tail');
    remarkBlogWikilinks()(tree, { path: `${process.cwd()}/${zh.path}` });
    expect(tree.children[0].children[0].value).toBe('&lt;img src=x onerror=alert(1)&gt; <a href="/zh-tw/blog/hello-blog">safe</a> &amp; tail');
  });
  test('exact-title resolution preserves special characters before HTML escaping', () => {
    const special = change({ title: 'A & B' });
    expect(resolveWikilinks('<p>[[A &amp; B|read]]</p>', buildIndex([special]), 'zh')).toBe('<p><a href="/zh-tw/blog/hello-blog">read</a></p>');
  });
});
