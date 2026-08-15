// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightRosePine from 'starlight-theme-rose-pine'

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://daviddejesus.me',
  base: '/nefis',

  integrations: [
    	starlight({
        	plugins: [starlightRosePine()],
      		title: 'Nefis Docs',
    			customCss: [
			    	'./src/styles/global.css',
      			],
        	social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/withastro/starlight' }],
        	sidebar: [
            	{
                  label: 'Guides',
                  items: [
                      // Each item here is one entry in the navigation menu.
                      { label: 'Example Guide', slug: 'guides/example' },
                  ],
              },
              {
                  label: 'Reference',
                  items: [{ autogenerate: { directory: 'reference' } }],
              },
          ],
      }),
	],

  vite: {
    plugins: [tailwindcss()],
  },
});