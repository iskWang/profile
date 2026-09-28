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

const LOCALES = new Set(['zh-tw', 'en']);

// Old SPA share links used ?lang=zh / ?lang=en.
const LEGACY_LANG = { zh: 'zh-tw', 'zh-tw': 'zh-tw', en: 'en' };

// Explicit choice first (legacy ?lang= link, then cookie `lang` from the language
// switch), otherwise the browser preference.
function preferredLocale(request) {
  const legacy = LEGACY_LANG[new URL(request.url).searchParams.get('lang')];
  if (legacy) return legacy;
  const cookies = request.headers.get('Cookie') || '';
  const saved = cookies.split(';').map((part) => part.trim()).find((part) => part.startsWith('lang='))?.slice(5);
  if (LOCALES.has(saved)) return saved;
  return prefersEnglish(request.headers.get('Accept-Language') || '') ? 'en' : 'zh-tw';
}

// The target depends on the visitor, so the redirect must never be cached as shared.
function localeRedirect(location) {
  return new Response(null, {
    status: 302,
    headers: { Location: location, 'Cache-Control': 'no-store', Vary: 'Accept-Language, Cookie' },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname === 'profile.joshwang.dev') {
      return Response.redirect(`${env.SITE_URL}${url.pathname}${url.search}`, 301);
    }

    const accept = request.headers.get('Accept') || '';
    const isHomepage = url.pathname === '/' || url.pathname === '/zh-tw' || url.pathname === '/en';

    // Markdown for Agents: serve llms.txt when Accept: text/markdown on any homepage path.
    // Must run before the locale redirect below, otherwise '/' never reaches this branch.
    if (accept.includes('text/markdown') && isHomepage) {
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

    if (url.pathname === '/') {
      return localeRedirect(`${url.origin}/${preferredLocale(request)}`);
    }

    if (url.pathname === '/blog' || (url.pathname.startsWith('/blog/') && !url.pathname.startsWith('/blog/assets/'))) {
      const target = url.pathname.replace(/^\/blog/, `/${preferredLocale(request)}/blog`);
      return localeRedirect(`${url.origin}${target}${url.search}`);
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
