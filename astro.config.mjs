import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { stripPostFooter } from './src/plugins/strip-footer.mjs';

export default defineConfig({
  site: 'https://www.sahilsinghrawat.com',
  trailingSlash: 'always',
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    remarkPlugins: [stripPostFooter],
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'one-dark-pro', // vibrant palette for Java, Go, JS, Bash
      },
      wrap: true,
    },
  },
});