// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';

import tailwindcss from '@tailwindcss/vite';

import preact from '@astrojs/preact';

// https://astro.build/config
export default defineConfig({
  site: 'https://daviddejesus.me',
  base: '/blog-preview/',

  integrations: [mdx(), preact()],

  vite: {
    plugins: [tailwindcss()]
  }
});