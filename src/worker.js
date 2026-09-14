function prefersEnglish(header) {
  const choices = header.split(',').map((part) => {
    const [locale, ...params] = part.trim().split(';');
    const quality = params.find((param) => param.trim().startsWith('q='));
    const q = quality ? Number(quality.trim().slice(2)) : 1;
    return { locale: locale.toLowerCase(), q: Number.isFinite(q) ? q : 0 };
  }).filter(({ locale, q }) => locale && q > 0);
  const english = choices.find(({ locale }) => locale === 'en' || locale.startsWith('en-'));
  if (!english) return false;
  const bestOther = Math.max(0, ...choices.filter(({ locale }) => locale !== 'en' && !locale.startsWith('en-')).map(({ q }) => q));
  return english.q > bestOther;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname === 'profile.joshwang.dev') {
      return Response.redirect(`${env.SITE_URL}${url.pathname}${url.search}`, 301);
    }

    const acceptLanguage = request.headers.get('Accept-Language') || '';
    if (url.pathname === '/') {
      const target = prefersEnglish(acceptLanguage) ? '/en' : '/zh-tw';
      return Response.redirect(`${url.origin}${target}`, 302);
    }

    if (url.pathname === '/blog' || (url.pathname.startsWith('/blog/') && !url.pathname.startsWith('/blog/assets/'))) {
      const locale = prefersEnglish(acceptLanguage) ? 'en' : 'zh-tw';
      const target = url.pathname.replace(/^\/blog/, `/${locale}/blog`);
      return Response.redirect(`${url.origin}${target}${url.search}`, 302);
    }

    const accept = request.headers.get('Accept') || '';

    if (url.pathname === '/deck' || url.pathname === '/deck/' || url.pathname === '/deck/index.html') {
      return Response.redirect(`${url.origin}/slides`, 301);
    }

    if (url.pathname === '/slides') {
      const slidesRequest = new Request(new URL('/slides/index.html', url), {
        method: request.method,
        headers: request.headers,
      });
      return env.ASSETS.fetch(slidesRequest);
    }

    // Markdown for Agents: serve llms.txt when Accept: text/markdown on homepage
    if (accept.includes('text/markdown') && url.pathname === '/') {
      const mdRequest = new Request(new URL('/llms.txt', url), {
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
    if (
      url.pathname === '/zh-tw' ||
      url.pathname === '/zh-tw/index.html' ||
      url.pathname === '/en' ||
      url.pathname === '/en/index.html'
    ) {
      headers.append('Link', `<${url.origin}/sitemap-index.xml>; rel="sitemap"`);
      headers.append('Link', `<${url.origin}/.well-known/api-catalog>; rel="api-catalog"`);
      headers.append('Link', `<${url.origin}/llms.txt>; rel="describedby"`);
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
