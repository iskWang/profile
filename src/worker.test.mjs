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

  test('301s legacy /?lang=zh|en to the locale homepage', async () => {
    for (const [q, to] of [['zh', '/zh-tw'], ['en', '/en']]) {
      const res = await worker.fetch(req(`/?lang=${q}`), makeEnv());
      expect(res.status).toBe(301);
      expect(res.headers.get('Location')).toBe(`https://joshwang.dev${to}`);
    }
  });

  test('unknown ?lang values (incl. __proto__) fall through to the 302 Accept-Language redirect', async () => {
    for (const q of ['__proto__', 'constructor', 'fr', '']) {
      const res = await worker.fetch(req(`/?lang=${q}`), makeEnv());
      expect(res.status).toBe(302);
      expect(res.headers.get('Location')).toBe('https://joshwang.dev/zh-tw');
    }
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
    expect(links).toContain('<https://joshwang.dev/sitemap.xml>; rel="sitemap"');
    expect(links).toContain('<https://joshwang.dev/.well-known/api-catalog>; rel="api-catalog"');
  });

  test('adds charset=utf-8 to non-HTML text responses', async () => {
    const env = makeEnv({ '/robots.txt': () => new Response('User-agent: *', { status: 200, headers: { 'Content-Type': 'text/plain' } }) });
    const response = await worker.fetch(req('/robots.txt'), env);
    expect(response.headers.get('Content-Type')).toBe('text/plain; charset=utf-8');
  });

  test('honors Accept quality when choosing HTML or explicit Markdown', async () => {
    const path = '/en/blog/hello-blog';
    for (const [accept, markdown] of [
      ['text/html, text/markdown;q=0', false],
      ['text/html;q=1, text/markdown;q=.5', false],
      ['text/markdown;q=1, text/html;q=.5', true],
      ['text/markdown', true],
      ['', false],
      ['text/markdown;q=0', false],
      ['text/markdown;q=.5, text/*;q=1', false],
      ['text/markdown;q=.5, text/html;q=0, */*;q=1', true],
    ]) {
      const env = makeEnv({
        [path]: () => new Response('<html>post</html>', { headers: { 'Content-Type': 'text/html' } }),
        [`${path}.md`]: () => new Response('# Post', { headers: { 'Content-Type': 'text/markdown' } }),
      });
      const response = await worker.fetch(req(path, accept ? { Accept: accept } : {}), env);
      expect(response.status).toBe(200);
      expect(await response.text()).toBe(markdown ? '# Post' : '<html>post</html>');
      expect(response.headers.get('Content-Type')).toBe(markdown ? 'text/markdown; charset=utf-8' : 'text/html');
      expect(env.ASSETS.calls).toEqual([`https://joshwang.dev${path}${markdown ? '.md' : ''}`]);
    }
  });

  test('negotiates both locales, trailing slashes, and canonical post links', async () => {
    for (const locale of ['zh-tw', 'en']) {
      for (const slug of ['', 'hello-blog']) {
        const path = `/${locale}/blog${slug ? `/${slug}` : ''}`;
        const markdownPath = `/${locale}/blog/${slug || 'index'}.md`;
        for (const suffix of ['', '/']) {
          const env = makeEnv({ [markdownPath]: () => new Response('# Markdown', {
            headers: { Vary: 'Accept-Encoding', 'X-Asset': 'preserved' },
          }) });
          const response = await worker.fetch(req(`${path}${suffix}`, { Accept: 'text/html, text/markdown' }), env);
          expect(response.status).toBe(200);
          expect(await response.text()).toBe('# Markdown');
          expect(response.headers.get('Content-Type')).toBe('text/markdown; charset=utf-8');
          expect(response.headers.get('Vary')).toBe('Accept-Encoding, Accept');
          expect(response.headers.get('Cache-Control')).toBe('no-store');
          expect(response.headers.get('X-Asset')).toBe('preserved');
          expect(response.headers.get('Link')).toContain('rel="mcp-server-card"');
          expect(response.headers.get('Link')).toContain('rel="api-catalog"');
          if (slug) expect(response.headers.get('Link')).toContain(`<https://joshwang.dev${path}>; rel="canonical"`);
          expect(env.ASSETS.calls).toEqual([`https://joshwang.dev${markdownPath}`]);
        }
      }
    }
  });

  test('adds discovery and alternate Markdown links to successful blog HTML only', async () => {
    for (const locale of ['zh-tw', 'en']) {
      for (const slug of ['', 'hello-blog']) {
        for (const suffix of ['', '/']) {
          const path = `/${locale}/blog${slug ? `/${slug}` : ''}${suffix}`;
          const env = makeEnv({ [path]: () => new Response('<html>blog</html>', {
            headers: { 'Content-Type': 'text/html', Vary: 'Accept-Encoding' },
          }) });
          const response = await worker.fetch(req(path), env);
          expect(response.status).toBe(200);
          expect(response.headers.get('Content-Type')).toBe('text/html');
          expect(response.headers.get('Vary')).toBe('Accept-Encoding, Accept');
          expect(response.headers.get('Cache-Control')).toBe('no-store');
          const links = response.headers.get('Link');
          for (const relation of ['sitemap', 'api-catalog', 'describedby', 'mcp-server-card']) {
            expect(links).toContain(`rel="${relation}"`);
          }
          expect(links).toContain(`<https://joshwang.dev/${locale}/blog/${slug || 'index'}.md>; rel="alternate"; type="text/markdown"`);
          expect(env.ASSETS.calls).toEqual([`https://joshwang.dev${path}`]);
        }
      }
    }
  });

  test('adds discovery and cache protection to negotiated homepage Markdown', async () => {
    for (const path of ['/', '/zh-tw', '/en']) {
      const env = makeEnv({ '/llms.txt': () => new Response(LLMS_BODY) });
      const response = await worker.fetch(req(path, { Accept: 'text/markdown' }), env);
      expect(response.headers.get('Vary')).toBe('Accept');
      expect(response.headers.get('Cache-Control')).toBe('no-store');
      for (const relation of ['sitemap', 'api-catalog', 'describedby', 'mcp-server-card']) {
        expect(response.headers.get('Link')).toContain(`rel="${relation}"`);
      }
    }
  });

  test('missing Markdown falls through to normal 404 or HTML without mislabelling it', async () => {
    const path = '/zh-tw/blog/nonexistent-post';
    const env = makeEnv();
    const missing = await worker.fetch(req(path, { Accept: 'text/markdown' }), env);
    expect(missing.status).toBe(404);
    expect(await missing.text()).toBe('not found');
    expect(missing.headers.get('Content-Type') || '').not.toContain('text/markdown');
    expect(missing.headers.get('Vary')).toBe('Accept');
    expect(missing.headers.get('Link')).toBeNull();
    expect(env.ASSETS.calls).toEqual([`https://joshwang.dev${path}.md`, `https://joshwang.dev${path}`]);
    const html = await worker.fetch(req(path, { Accept: 'text/markdown' }), makeEnv({
      [path]: () => new Response('<html>fallback</html>', { headers: { 'Content-Type': 'text/html' } }),
    }));
    expect(html.headers.get('Content-Type')).toBe('text/html');
    expect(await html.text()).toBe('<html>fallback</html>');
  });

  test('never negotiates feeds, direct Markdown, assets, or invalid slugs', async () => {
    for (const path of [
      '/zh-tw/blog/__proto__', '/zh-tw/blog/rss.xml', '/en/blog/rss.xml',
      '/zh-tw/blog/index.md', '/en/blog/hello-blog.md',
      '/blog/assets/hello-blog/cat-mascot.webp', '/zh-tw/blog/assets/cat.webp',
      '/zh-tw/blog/Hello', '/zh-tw/blog/hello--blog', '/zh-tw/blog/hello/blog',
    ]) {
      for (const Accept of ['*/*', 'text/markdown']) {
        const env = makeEnv();
        const response = await worker.fetch(req(path, { Accept }), env);
        expect(response.status).toBe(404);
        expect(env.ASSETS.calls).toEqual([`https://joshwang.dev${path}`]);
      }
    }
  });

  test('keeps legacy blog redirects and direct slides under Markdown requests', async () => {
    for (const path of ['/blog', '/blog/hello-blog']) {
      const env = makeEnv();
      const response = await worker.fetch(req(`${path}?x=1`, { Accept: 'text/markdown', 'Accept-Language': 'en' }), env);
      expect(response.status).toBe(302);
      expect(response.headers.get('Location')).toBe(`https://joshwang.dev/en${path}?x=1`);
      expect(env.ASSETS.calls).toEqual([]);
    }
    for (const path of ['/deck', '/deck/', '/deck/index.html']) {
      const response = await worker.fetch(req(path, { Accept: 'text/markdown' }), makeEnv());
      expect(response.status).toBe(301);
      expect(response.headers.get('Location')).toBe('https://joshwang.dev/slides');
    }
    const request = req('/slides', { Accept: 'text/markdown' });
    const assetResponse = new Response('<html>slides</html>');
    const response = await worker.fetch(request, {
      ASSETS: { fetch: async (forwarded) => {
        expect(forwarded).toBe(request);
        return assetResponse;
      } },
    });
    expect(response).toBe(assetResponse);
  });

  test('enforces the API catalog media type without relying on asset headers', async () => {
    const env = makeEnv({
      '/.well-known/api-catalog': () => new Response('{"linkset":[]}', {
        headers: { 'Content-Type': 'application/json', 'X-Asset': 'preserved' },
      }),
    });
    const response = await worker.fetch(req('/.well-known/api-catalog'), env);
    expect(response.headers.get('Content-Type')).toBe('application/linkset+json; charset=utf-8');
    expect(response.headers.get('X-Asset')).toBe('preserved');
    expect(await response.text()).toBe('{"linkset":[]}');
  });
});
