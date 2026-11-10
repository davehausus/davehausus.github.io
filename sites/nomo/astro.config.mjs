// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightThemeVintage from 'starlight-theme-vintage'
import starlightSidebarTopics from 'starlight-sidebar-topics';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://daviddejesus.me',
  base: '/nomo',

  integrations: [
    	starlight({
        	title: 'Nomo Product Experience OS',
			    customCss: ['./src/styles/global.css',],
    		  social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/withastro/starlight' }],
        	plugins: [
            starlightThemeVintage(),
            starlightSidebarTopics([
              {
                label: 'Brand Operating System',
                link: '/bos/',
                icon: 'open-book',
                items: [{ autogenerate: { directory: 'bos' } }],
              },
              {
                label: 'Creative Translation System',
                link: '/cts/',
                icon: 'pencil',
                items: [{ autogenerate: { directory: 'cts' } }],
              },
            ]),
          ],
      }),
	],

  vite: {
    plugins: [tailwindcss()],
  },
});