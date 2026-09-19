import { describe, expect, test, beforeAll } from 'bun:test';
import worker from './worker.js';

beforeAll(() => {
  // Cloudflare Workers runtime provides `caches`; Bun's test runtime does not.
  globalThis.caches = { default: { delete: async () => true } };
});

const LLMS_BODY = '# Josh Wang — Resume\n';

function makeAssets(routes) {
  const calls = [];
  return {
    calls,
    fetch: async (request) => {
      calls.push(request.url);
      const url = new URL(request.url);
      const handler = routes[url.pathname];
      if (handler) return handler();
      return new Response('not found', { status: 404 });
    },
  };
}

function makeEnv(routes = {}) {
  return { SITE_URL: 'https://joshwang.dev', ASSETS: makeAssets(routes) };
}

const req = (path, headers = {}) => new Request(`https://joshwang.dev${path}`, { headers });

describe('worker routing', () => {
  test('redirects the legacy hostname to the canonical domain', async () => {
    const env = makeEnv();
    const response = await worker.fetch(new Request('https://profile.joshwang.dev/blog/x?y=1'), env);
    expect(response.status).toBe(301);
    expect(response.headers.get('Location')).toBe('https://joshwang.dev/blog/x?y=1');
  });

  test('serves llms.txt for Accept: text/markdown on / without redirecting first', async () => {
    const env = makeEnv({ '/llms.txt': () => new Response(LLMS_BODY, { status: 200 }) });
    const response = await worker.fetch(req('/', { Accept: 'text/markdown' }), env);
    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('text/markdown; charset=utf-8');
    expect(await response.text()).toBe(LLMS_BODY);
  });

  test('serves llms.txt for Accept: text/markdown on the locale homepages too', async () => {
    const env = makeEnv({ '/llms.txt': () => new Response(LLMS_BODY, { status: 200 }) });
    for (const path of ['/zh-tw', '/en']) {
      const response = await worker.fetch(req(path, { Accept: 'text/markdown' }), env);
      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe('text/markdown; charset=utf-8');
    }
  });

  test('redirects / by Accept-Language when markdown is not requested', async () => {
    const env = makeEnv();
    const en = await worker.fetch(req('/', { 'Accept-Language': 'en-US,en;q=0.9' }), env);
    expect(en.status).toBe(302);
    expect(en.headers.get('Location')).toBe('https://joshwang.dev/en');

    const zh = await worker.fetch(req('/', { 'Accept-Language': 'zh-TW,zh;q=0.9' }), env);
    expect(zh.status).toBe(302);
    expect(zh.headers.get('Location')).toBe('https://joshwang.dev/zh-tw');
  });

  test('redirects old /blog paths into the preferred locale', async () => {
    const env = makeEnv();
    const response = await worker.fetch(req('/blog/hello-blog', { 'Accept-Language': 'en' }), env);
    expect(response.status).toBe(302);
    expect(response.headers.get('Location')).toBe('https://joshwang.dev/en/blog/hello-blog');
  });

  test('redirects /deck to /slides', async () => {
    const env = makeEnv();
    const response = await worker.fetch(req('/deck'), env);
    expect(response.status).toBe(301);
    expect(response.headers.get('Location')).toBe('https://joshwang.dev/slides');
  });

  test('/slides is served directly without rewriting to /slides/index.html', async () => {
    // Regression: html_handling "drop-trailing-slash" 307-redirects /slides/index.html back to
    // /slides, so rewriting the request there caused an infinite redirect loop. The worker must
    // forward the original /slides request as-is.
    const assets = makeAssets({ '/slides': () => new Response('<html>deck</html>', { status: 200 }) });
    const env = { SITE_URL: 'https://joshwang.dev', ASSETS: assets };
    const response = await worker.fetch(req('/slides'), env);
    expect(response.status).toBe(200);
    expect(await response.text()).toBe('<html>deck</html>');
    expect(assets.calls).toEqual(['https://joshwang.dev/slides']);
  });

  test('adds sitemap/api-catalog/llms Link headers on locale homepages', async () => {
    const env = makeEnv({ '/zh-tw': () => new Response('<html></html>', { status: 200, headers: { 'Content-Type': 'text/html' } }) });
    const response = await worker.fetch(req('/zh-tw'), env);
    const links = response.headers.get('Link');
    expect(links).toContain('<https://joshwang.dev/sitemap-index.xml>; rel="sitemap"');
    expect(links).toContain('<https://joshwang.dev/.well-known/api-catalog>; rel="api-catalog"');
  });

  test('adds charset=utf-8 to non-HTML text responses', async () => {
    const env = makeEnv({ '/robots.txt': () => new Response('User-agent: *', { status: 200, headers: { 'Content-Type': 'text/plain' } }) });
    const response = await worker.fetch(req('/robots.txt'), env);
    expect(response.headers.get('Content-Type')).toBe('text/plain; charset=utf-8');
  });
});
