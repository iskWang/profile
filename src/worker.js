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

function prefersMarkdown(header) {
  let markdown = 0;
  let html = 0;
  let htmlSpecificity = -1;
  for (const part of header.split(',')) {
    const [mediaType, ...params] = part.trim().toLowerCase().split(';');
    const type = mediaType.trim();
    const quality = params.find((param) => param.trim().startsWith('q='));
    const value = quality ? Number(quality.trim().slice(2)) : 1;
    const q = Number.isFinite(value) && value >= 0 && value <= 1 ? value : 0;
    // Markdown remains opt-in; wildcards only determine the HTML preference.
    if (type === 'text/markdown') markdown = q;
    const specificity = type === 'text/html' ? 2 : type === 'text/*' ? 1 : type === '*/*' ? 0 : -1;
    if (specificity > htmlSpecificity) {
      html = q;
      htmlSpecificity = specificity;
    }
  }
  return markdown > 0 && markdown >= html;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname === 'profile.joshwang.dev') {
      return Response.redirect(`${env.SITE_URL}${url.pathname}${url.search}`, 301);
    }

    const accept = request.headers.get('Accept') || '';
    const isHomepage = url.pathname === '/' || url.pathname === '/zh-tw' || url.pathname === '/en';
    const blog = url.pathname.match(/^\/(zh-tw|en)\/blog(?:\/([a-z0-9]+(?:-[a-z0-9]+)*))?\/?$/);
    const markdownPath = isHomepage ? '/llms.txt' : blog ? `/${blog[1]}/blog/${blog[2] || 'index'}.md` : null;
    let response;

    // Negotiate before redirects so '/' can serve Markdown without a locale redirect.
    if (markdownPath && prefersMarkdown(accept)) {
      const mdRequest = new Request(new URL(markdownPath, url), {
        method: request.method,
        headers: request.headers,
      });
      const mdResponse = await env.ASSETS.fetch(mdRequest);
      if (mdResponse.ok) {
        response = mdResponse;
      }
    }

    const acceptLanguage = request.headers.get('Accept-Language') || '';
    if (!response && url.pathname === '/') {
      // Legacy ?lang=zh|en URLs are still indexed by Google: permanent redirect so they consolidate.
      const lang = url.searchParams.get('lang');
      const legacy = lang === 'zh' ? '/zh-tw' : lang === 'en' ? '/en' : null;
      if (legacy) return Response.redirect(`${url.origin}${legacy}`, 301);
      const target = prefersEnglish(acceptLanguage) ? '/en' : '/zh-tw';
      return Response.redirect(`${url.origin}${target}`, 302);
    }

    if (url.pathname === '/blog' || (url.pathname.startsWith('/blog/') && !url.pathname.startsWith('/blog/assets/'))) {
      const locale = prefersEnglish(acceptLanguage) ? 'en' : 'zh-tw';
      const target = url.pathname.replace(/^\/blog/, `/${locale}/blog`);
      return Response.redirect(`${url.origin}${target}${url.search}`, 302);
    }

    if (url.pathname === '/deck' || url.pathname === '/deck/' || url.pathname === '/deck/index.html') {
      return Response.redirect(`${url.origin}/slides`, 301);
    }

    if (url.pathname === '/slides') {
      // Forward the request as-is: with html_handling "drop-trailing-slash", the canonical
      // URL for a folder index is the folder path without a trailing slash (matches /folder
      // in Cloudflare's routing table). Rewriting to /slides/index.html instead hits the
      // /folder/index.html row, which 307-redirects back to /slides and loops forever.
      return env.ASSETS.fetch(request);
    }

    const negotiatedMarkdown = Boolean(response);
    response ??= await env.ASSETS.fetch(request);
    const headers = new Headers(response.headers);
    // Ensure charset=utf-8 on non-HTML text responses (.md, .txt, .xml, etc.).
    const ct = headers.get('Content-Type') || '';
    if (ct.startsWith('text/') && !ct.includes('text/html') && !ct.includes('charset')) {
      headers.set('Content-Type', `${ct}; charset=utf-8`);
    }
    if (negotiatedMarkdown) {
      headers.set('Content-Type', 'text/markdown; charset=utf-8');
    }

    // Keep negotiated representations out of shared caches; preserve other Vary tokens.
    if (
      isHomepage || blog ||
      url.pathname === '/zh-tw/index.html' ||
      url.pathname === '/en/index.html'
    ) {
      if (response.ok && (negotiatedMarkdown || headers.get('Content-Type')?.includes('text/html'))) {
        headers.append('Link', `<${url.origin}/sitemap.xml>; rel="sitemap"`);
        headers.append('Link', `<${url.origin}/.well-known/api-catalog>; rel="api-catalog"`);
        headers.append('Link', `<${url.origin}/llms.txt>; rel="describedby"`);
        headers.append('Link', `<${url.origin}/.well-known/mcp/server-card.json>; rel="mcp-server-card"`);
        if (blog) {
          if (negotiatedMarkdown && blog[2]) {
            headers.append('Link', `<${url.origin}/${blog[1]}/blog/${blog[2]}>; rel="canonical"`);
          } else if (!negotiatedMarkdown) {
            headers.append('Link', `<${url.origin}${markdownPath}>; rel="alternate"; type="text/markdown"`);
          }
        }
      }
      if (!headers.get('Vary')?.split(',').some((value) => value.trim().toLowerCase() === 'accept')) {
        headers.append('Vary', 'Accept');
      }
      headers.set('Cache-Control', 'no-store');
      await caches.default.delete(new Request(request.url));
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    }

    // Guarantee the discovery media type even when asset headers are not applied.
    if (url.pathname === '/.well-known/api-catalog') {
      headers.set('Content-Type', 'application/linkset+json; charset=utf-8');
      return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
    }

    if (headers.get('Content-Type') !== response.headers.get('Content-Type')) {
      return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
    }

    return response;
  },
};
