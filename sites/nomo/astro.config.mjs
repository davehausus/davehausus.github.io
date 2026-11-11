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
        	title: 'Nomo Product Experience OS',
			    customCss: ['./src/styles/global.css',],
          components: { Head: './src/components/Head.astro', },
    		  social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/withastro/starlight' }],
        	plugins: [
            starlightThemeVintage(),
            starlightSidebarTopics([
              {
                label: 'Brand Operating System',
                link: '/bos/',
                icon: 'open-book',
                items: [
                  {
                    label: 'Part I',
                    items: [{ autogenerate: { directory: 'bos/part-i' } }],
                  },
                ],
              },
              {
                label: 'Creative Translation System',
                link: '/cts/',
                icon: 'pencil',
                items: [
                  { autogenerate: { directory: 'cts' } }
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