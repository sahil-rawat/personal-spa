import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { stripPostFooter } from './src/plugins/strip-footer.mjs';
import { transformerNotationHighlight } from '@shikijs/transformers';
import { remarkCallouts } from './src/plugins/remark-callouts.mjs';
import { remarkReadingTime } from './src/plugins/remark-reading-time.mjs';

// Adds data-lang / data-title to <pre> so the page can show a language or filename label.
// Use ```js title="app.js" in Markdown; mark lines with // [!code highlight].
const codeMeta = {
  name: 'code-meta',
  pre(node) {
    node.properties['data-lang'] = this.options.lang;
    const m = /title="([^"]+)"/.exec(this.options.meta?.__raw || '');
    if (m) node.properties['data-title'] = m[1];
  },
};

export default defineConfig({
  site: 'https://www.sahilsinghrawat.com',
  trailingSlash: 'always',
  output: 'static',
  integrations: [sitemap({ filter: (page) => !page.includes('/404') })],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    remarkPlugins: [stripPostFooter, remarkReadingTime, remarkCallouts],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, {
        behavior: 'append',
        properties: { class: 'heading-anchor', ariaLabel: 'Link to this section' },
        content: { type: 'text', value: '#' },
      }],
    ],
    shikiConfig: {
      theme: 'one-dark-pro',
      wrap: true,
      transformers: [codeMeta, transformerNotationHighlight()],
    },
  },
});