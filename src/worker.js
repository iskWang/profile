const SITE_URL = 'https://profile.joshwang.dev';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const accept = request.headers.get('Accept') || '';

    // Markdown for Agents: serve index.md when Accept: text/markdown on homepage
    if (accept.includes('text/markdown') && url.pathname === '/') {
      const mdRequest = new Request(new URL('/index.md', url), {
        method: request.method,
        headers: request.headers,
      });
      const mdResponse = await env.ASSETS.fetch(mdRequest);
      if (mdResponse.ok) {
        return new Response(mdResponse.body, {
          status: mdResponse.status,
          headers: {
            'Content-Type': 'text/markdown; charset=utf-8',
            'Vary': 'Accept',
          },
        });
      }
    }

    const response = await env.ASSETS.fetch(request);
    const headers = new Headers(response.headers);

    // Add Link response headers to homepage (RFC 8288)
    if (url.pathname === '/' || url.pathname === '/index.html') {
      headers.append('Link', `<${SITE_URL}/sitemap.xml>; rel="sitemap"`);
      headers.append('Link', `<${SITE_URL}/.well-known/api-catalog>; rel="api-catalog"`);
      headers.set('Vary', 'Accept');
      headers.set('Cache-Control', 'no-store');
      await caches.default.delete(new Request(request.url));
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    }

    // Ensure charset=utf-8 on non-HTML text responses (.md, .txt, .xml, etc.)
    const ct = headers.get('Content-Type') || '';
    if (ct.startsWith('text/') && !ct.includes('text/html') && !ct.includes('charset')) {
      headers.set('Content-Type', `${ct}; charset=utf-8`);
      return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
    }

    return response;
  },
};
