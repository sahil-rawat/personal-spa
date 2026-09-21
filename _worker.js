export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);

      // Explicit prefixes that belong strictly to your Jekyll Chirpy blog
      const blogPrefixes = [
        '/posts',
        '/archives',
        '/categories',
        '/tags',
        '/assets',        // <-- CRITICAL: Contains style.css, webfonts, js bundles
        '/tabs',
        '/feed.xml',
        '/robots.txt',
        '/sitemap.xml'
      ];

      const isBlogPath = blogPrefixes.some(prefix => url.pathname.startsWith(prefix));

      if (isBlogPath) {
        // Forward request to GitHub Pages
        const targetUrl = new URL(url.pathname + url.search, 'https://sahil-rawat.github.io');

        const headers = new Headers(request.headers);
        headers.set('Host', 'sahil-rawat.github.io');
        headers.delete('cf-connecting-ip');
        headers.delete('cf-ray');

        const proxyRequest = new Request(targetUrl.toString(), {
          method: request.method,
          headers: headers,
          body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : null,
          redirect: 'follow'
        });

        const response = await fetch(proxyRequest);

        // Re-construct the response so content-type & caching headers stay intact
        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers
        });
      }

      // Root path '/' and SPA static assets
      if (env && env.ASSETS && typeof env.ASSETS.fetch === 'function') {
        const response = await env.ASSETS.fetch(request);
        if (response.status === 404 && request.method === 'GET' && !url.pathname.includes('.')) {
          const indexUrl = new URL('/', request.url);
          return await env.ASSETS.fetch(new Request(indexUrl, request));
        }
        return response;
      }

      return await fetch(request);

    } catch (err) {
      return new Response(`Proxy Error: ${err.message}\n${err.stack}`, {
        status: 500,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
  }
};