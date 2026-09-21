export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Define paths that belong to your existing Jekyll blog
    const blogPaths = ['/posts', '/archives', '/categories', '/tags', '/feed.xml'];

    const isBlogPath = blogPaths.some(path => url.pathname.startsWith(path));

    if (isBlogPath) {
      // Forward request to your GitHub Pages backend
      const targetUrl = new URL(url.pathname + url.search, 'https://sahil-rawat.github.io');
      const modifiedRequest = new Request(targetUrl, {
        method: request.method,
        headers: request.headers,
        body: request.body,
        redirect: 'follow'
      });
      return fetch(modifiedRequest);
    }

    // Serve the SPA directly for root and SPA routes
    return env.ASSETS.fetch(request);
  }
};