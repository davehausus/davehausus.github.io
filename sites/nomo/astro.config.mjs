// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightThemeVintage from 'starlight-theme-vintage'
import starlightSidebarTopics from 'starlight-sidebar-topics';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://daviddejesus.me',
  base: '/nomo',
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Poppins',
      cssVariable: '--font-poppins',
      weights: [200, 400, 700],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['sans-serif'],
    },
  ],
  integrations: [
    	starlight({
        	title: 'nomo',
			    customCss: ['./src/styles/global.css',],
          components: { Head: './src/components/Head.astro', },
    		  social: [],
        	plugins: [
            starlightThemeVintage(),
            starlightSidebarTopics([
              {
                label: 'I. Foundations',
                link: '/foundations/',
                icon: 'open-book',
                items: [
                  {
                    label: 'Part I',
                    items: [{ autogenerate: { directory: 'foundations/part-i' } }],
                  },
                ],
              },
              {
                label: 'II. People & Evidence',
                link: '/people/',
                icon: 'pencil',
                items: [
                  { autogenerate: { directory: 'people' } }
                ],
              },
            ]),
          ],
      }),
	],

  vite: {
    plugins: [tailwindcss()],
  },
});