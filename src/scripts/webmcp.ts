import { z } from 'zod';

type BlogPost = { title: string; summary: string; topics: string[]; lang: string; [key: string]: unknown };
type Tool = { name: string; description: string; inputSchema: object; annotations: { readOnlyHint: true }; execute: (...args: never[]) => unknown };
type ModelContext = { registerTool: (tool: Tool, options: { signal: AbortSignal }) => void | Promise<void> };
const isBlogPost = (post: unknown): post is BlogPost => Boolean(
  post && typeof post === 'object' && 'title' in post && typeof post.title === 'string'
  && 'summary' in post && typeof post.summary === 'string' && 'lang' in post && typeof post.lang === 'string'
  && 'topics' in post && Array.isArray(post.topics) && post.topics.every((topic: unknown) => typeof topic === 'string')
);
const searchInput = z.object({
  query: z.string().optional(),
  topic: z.string().optional(),
  lang: z.enum(['zh-tw', 'en']).optional(),
  limit: z.number().int().min(1).max(20).default(10),
}).strict();
const profileInput = z.object({
  resource: z.enum(['overview', 'resume-en', 'resume-zh']).default('overview'),
}).strict();

(async () => {
const documentContext = 'modelContext' in document ? document.modelContext : undefined;
const navigatorContext = 'modelContext' in navigator ? navigator.modelContext : undefined;
const mc = (documentContext ?? navigatorContext) as ModelContext | undefined;
if (!mc || typeof mc.registerTool !== 'function') return;

const controller = new AbortController();
let blogIndex: Promise<BlogPost[]> | undefined;
const jsonText = (value: unknown) => ({ content: [{ type: 'text', text: JSON.stringify(value, null, 2) }] });
const textResult = (text: string) => ({ content: [{ type: 'text', text }] });
const getPosts = (signal?: AbortSignal) => {
  blogIndex ??= (async () => {
    const response = await fetch('/blog-index.json', { signal });
    if (!response.ok) throw new Error(`Blog index request failed: ${response.status}`);
    const data: unknown = await response.json();
    const posts = Array.isArray(data) ? data : data && typeof data === 'object' && 'posts' in data ? data.posts : undefined;
    if (!Array.isArray(posts) || !posts.every(isBlogPost)) throw new Error('Blog index has an invalid format');
    return posts;
  })().catch(error => {
    blogIndex = undefined;
    throw error;
  });
  return blogIndex;
};

try {
  await mc.registerTool({
    name: 'search_blog_posts',
    description: "Search or filter Josh Wang's published blog posts",
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Keyword substring in title, summary, or topics' },
        topic: { type: 'string', description: 'Exact kebab-case topic tag' },
        lang: { type: 'string', enum: ['zh-tw', 'en'] },
        limit: { type: 'integer', minimum: 1, maximum: 20, default: 10 },
      },
      additionalProperties: false,
    },
    annotations: { readOnlyHint: true },
    execute: async (input: unknown = {}, { signal }: { signal?: AbortSignal } = {}) => {
      const { query, topic, lang, limit } = searchInput.parse(input);
      const posts = await getPosts(signal);
      const needle = query?.toLocaleLowerCase();
      return jsonText(posts.filter(post =>
        (!lang || (lang === 'zh-tw' ? post.lang === 'zh-tw' || post.lang === 'zh' : post.lang === lang)) &&
        (!topic || post.topics?.includes(topic)) &&
        (!needle || [post.title, post.summary, ...(post.topics ?? [])].some(value => String(value).toLocaleLowerCase().includes(needle)))
      ).slice(0, limit));
    },
  }, { signal: controller.signal });

  await mc.registerTool({
    name: 'get_profile_markdown',
    description: "Fetch Josh Wang's machine-readable Markdown profile or resume",
    inputSchema: {
      type: 'object',
      properties: { resource: { type: 'string', enum: ['overview', 'resume-en', 'resume-zh'], default: 'overview' } },
      additionalProperties: false,
    },
    annotations: { readOnlyHint: true },
    execute: async (input: unknown = {}, { signal }: { signal?: AbortSignal } = {}) => {
      const { resource } = profileInput.parse(input);
      const path = resource === 'resume-en' ? '/resume.en.md' : resource === 'resume-zh' ? '/resume.zh.md' : '/llms.txt';
      const response = await fetch(path, { signal });
      if (!response.ok) throw new Error(`Profile request failed: ${response.status}`);
      return textResult(await response.text());
    },
  }, { signal: controller.signal });
} catch (error) {
  controller.abort();
  throw error;
}
})().catch(error => console.error('[webmcp] Tool registration failed', error));
