import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';
import { z } from 'zod';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import { parseFragment, serialize } from 'parse5';

const root = fileURLToPath(new URL('../', import.meta.url));
const kebab = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const reserved = new Set(['en', 'index', 'rss', 'assets', 'template']);
const markdown = unified().use(remarkParse);
const fail = (file, reason) => new Error(`blog: ${file}: ${reason}`);

export function postIdentity(file) {
  const match = path.posix.basename(file).match(/^(.+)\.(zh|en)\.md$/);
  if (!match || !kebab.test(match[1])) throw fail(file, 'filename must be <kebab-slug>.<zh|en>.md');
  if (reserved.has(match[1])) throw fail(file, `reserved slug: ${match[1]}`);
  return { slug: match[1], lang: match[2] };
}

export function createBlogSchema(zod, file) {
  const dateString = zod.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be YYYY-MM-DD').refine(value => {
    const parsed = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
  }, 'date must be a real calendar date');
  const date = zod.preprocess(value => value instanceof Date && !Number.isNaN(value.valueOf())
    ? value.toISOString().replace(/T00:00:00\.000Z$/, '')
    : value, dateString);
  const text = zod.string().trim().min(1);
  return zod.object({
    schema: zod.literal('blog-post'), lang: zod.enum(['zh', 'en']), title: text,
    date, summary: text.max(200), topics: zod.array(text.regex(kebab, 'topic must be kebab-case')).min(1),
    origin: zod.enum(['original', 'adapted']),
    source: zod.string().url().regex(/^https?:\/\//).optional(), source_title: text.optional(),
    source_date: date.optional(), vault_path: text.optional(),
    translation: zod.literal('machine-assisted').optional(), draft: zod.boolean().optional(), updated: date.optional(),
  }).superRefine((data, context) => {
    const issue = (field, message) => context.addIssue({ code: 'custom', path: [field], message });
    if (file && data.lang !== postIdentity(file).lang) issue('lang', 'lang must match filename suffix');
    if (data.origin === 'adapted') {
      if (!data.source) issue('source', 'origin: adapted requires source');
      if (!data.source_title) issue('source_title', 'origin: adapted requires source_title');
    } else if (data.source !== undefined || data.source_title !== undefined) {
      issue('origin', 'source and source_title are only allowed for origin: adapted');
    }
    if (data.translation && data.lang !== 'en') issue('translation', 'translation is only allowed on lang: en');
    const value = data.vault_path;
    if (value !== undefined) {
      if (['00_Inbox/', '10_Areas/', '20_Travel/', '90_Archive/', '_meta/'].some(prefix => value.startsWith(prefix))) {
        issue('vault_path', 'vault_path blacklist violation');
      }
      if (value.startsWith('/') || value.includes('\\') || value.split('/').includes('..') || path.posix.normalize(value) !== value) {
        issue('vault_path', 'vault_path escape or non-normalized path');
      }
      if (!value.startsWith('30_Resources/')) issue('vault_path', 'vault_path must start with 30_Resources/');
    }
  });
}

export function validateFrontmatter(data, file) {
  postIdentity(file);
  const result = createBlogSchema(z, file).safeParse(data);
  if (!result.success) throw fail(file, result.error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join('; '));
  return result.data;
}

export function loadPosts(directory = path.join(root, 'content/blog')) {
  const posts = [];
  const errors = [];
  for (const entry of fs.readdirSync(directory, { recursive: true, withFileTypes: true })) {
    if (!entry.isFile() || entry.name.startsWith('_') || !entry.name.endsWith('.md')) continue;
    const absolute = path.join(entry.parentPath, entry.name);
    const file = path.relative(root, absolute).split(path.sep).join('/');
    try {
      const source = fs.readFileSync(absolute, 'utf8');
      const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
      if (!match) throw fail(file, 'missing YAML frontmatter');
      let data;
      try { data = parseYaml(match[1]); } catch (error) { throw fail(file, `invalid YAML: ${error.message}`); }
      posts.push({ path: file, ...postIdentity(file), data: validateFrontmatter(data, file), body: source.slice(match[0].length) });
    } catch (error) { errors.push(error.message); }
  }
  return { posts, errors };
}

export function buildIndex(posts) {
  const index = { posts: [], zh: { slugs: new Map(), titles: new Map() }, en: { slugs: new Map(), titles: new Map() } };
  for (const post of posts) {
    if (post.data.draft) continue;
    const identity = postIdentity(post.path);
    const locale = index[post.data.lang];
    if (locale.slugs.has(identity.slug)) throw fail(post.path, `duplicate slug: ${identity.slug}`);
    index.posts.push(post);
    locale.slugs.set(identity.slug, post);
    const title = post.data.title;
    locale.titles.set(title, locale.titles.has(title) ? null : post);
  }
  return index;
}

function targetFor(target, index, lang, file = '<html>') {
  const locale = index[lang];
  const post = locale?.slugs.get(target) ?? locale?.titles.get(target);
  if (!post) throw fail(file, `unresolved wikilink: [[${target}]] (${lang})`);
  return `/${lang === 'zh' ? 'zh-tw' : 'en'}/blog/${postIdentity(post.path).slug}`;
}

function wikilinks(text, index, lang, file, render, encode = value => value) {
  if (text.includes('![[')) throw fail(file, 'Obsidian embed is not allowed');
  let result = '';
  let cursor = 0;
  for (const match of text.matchAll(/\[\[([^\]\n]+)\]\]/g)) {
    const value = match[1];
    const separator = value.indexOf('|');
    const target = (separator < 0 ? value : value.slice(0, separator)).trim();
    const label = separator < 0 ? target : value.slice(separator + 1);
    result += encode(text.slice(cursor, match.index)) + render(targetFor(target, index, lang, file), label);
    cursor = match.index + match[0].length;
  }
  return result + encode(text.slice(cursor));
}

const escapeHtml = value => value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);

export function resolveWikilinks(html, index, lang) {
  const fragment = parseFragment(html);
  function visit(node) {
    if (['code', 'pre', 'script', 'style', 'a'].includes(node.tagName)) return;
    if (!node.childNodes) return;
    node.childNodes = node.childNodes.flatMap(child => {
      if (child.nodeName !== '#text') { visit(child); return [child]; }
      if (!child.value.includes('[[')) return [child];
      const rewritten = wikilinks(child.value, index, lang, '<html>', (href, label) => `<a href="${href}">${escapeHtml(label)}</a>`, escapeHtml);
      const replacements = parseFragment(rewritten).childNodes;
      for (const replacement of replacements) replacement.parentNode = node;
      return replacements;
    });
  }
  visit(fragment);
  return serialize(fragment);
}

function validateHtmlWikilinks(html, index, lang, file) {
  const fragment = parseFragment(html);
  function visit(node) {
    if (['code', 'pre', 'script', 'style', 'a'].includes(node.tagName)) return;
    if (node.nodeName === '#text') {
      if (node.value.includes('[[')) wikilinks(node.value, index, lang, file, () => '');
      return;
    }
    node.childNodes?.forEach(visit);
  }
  visit(fragment);
}

function validateImage(src, alt, post) {
  const prefix = `/blog/assets/${postIdentity(post.path).slug}/`;
  if (!alt?.trim()) throw fail(post.path, 'image alt must be non-empty');
  let decoded;
  try { decoded = decodeURIComponent(src); } catch { throw fail(post.path, 'image src has invalid encoding'); }
  if (!decoded.startsWith(prefix) || decoded.includes('\\') || decoded.split('/').includes('..') || path.posix.normalize(decoded) !== decoded || /[?#]/.test(decoded)) {
    throw fail(post.path, `image src must stay under ${prefix}`);
  }
  const absolute = path.join(root, 'public', decoded);
  if (!fs.existsSync(absolute) || !fs.statSync(absolute).isFile()) throw fail(post.path, `image file does not exist: ${src}`);
  if (!fs.realpathSync(absolute).startsWith(path.resolve(root, 'public', `.${prefix}`) + path.sep)) throw fail(post.path, 'image src escapes asset directory');
}

export function validatePost(post, index) {
  validateFrontmatter(post.data, post.path);
  if (post.body.trimStart().startsWith('# ')) throw fail(post.path, 'body must not start with # ');
  const tree = markdown.parse(post.body);
  const definitions = new Map();
  function collect(node) {
    if (node.type === 'definition') definitions.set(node.identifier, node.url);
    node.children?.forEach(collect);
  }
  collect(tree);
  function visit(node) {
    if (node.type === 'code' || node.type === 'inlineCode') return;
    if (node.type === 'text') wikilinks(node.value, index, post.data.lang, post.path, () => '');
    if (node.type === 'image') validateImage(node.url, node.alt, post);
    if (node.type === 'imageReference') validateImage(definitions.get(node.identifier) ?? '', node.alt, post);
    if (node.type === 'html') {
      validateHtmlWikilinks(node.value, index, post.data.lang, post.path);
      const fragment = parseFragment(node.value);
      function images(element) {
        if (element.tagName === 'img') {
          const attrs = Object.fromEntries(element.attrs.map(attr => [attr.name, attr.value]));
          validateImage(attrs.src ?? '', attrs.alt, post);
        }
        element.childNodes?.forEach(images);
      }
      images(fragment);
    }
    node.children?.forEach(visit);
  }
  visit(tree);
}

export function remarkBlogWikilinks() {
  return (tree, file) => {
    if (!file.path || !file.path.split(path.sep).join('/').includes('/content/blog/')) return;
    const { posts, errors } = loadPosts();
    if (errors.length) throw new Error(errors.join('\n'));
    const index = buildIndex(posts);
    const lang = postIdentity(file.path).lang;
    function visit(node) {
      if (['code', 'inlineCode', 'link', 'linkReference'].includes(node.type) || !node.children) return;
      node.children = node.children.flatMap(child => {
        if (child.type === 'html' && child.value.includes('[[')) {
          return [{ type: 'html', value: resolveWikilinks(child.value, index, lang) }];
        }
        if (child.type !== 'text' || !child.value.includes('[[')) { visit(child); return [child]; }
        const html = wikilinks(child.value, index, lang, path.relative(root, file.path), (href, label) => `<a href="${href}">${escapeHtml(label)}</a>`, escapeHtml);
        return [{ type: 'html', value: html }];
      });
    }
    visit(tree);
  };
}
