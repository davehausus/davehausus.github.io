// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightRosePine from 'starlight-theme-rose-pine'
import starlightSidebarTopics from 'starlight-sidebar-topics';


import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://daviddejesus.me',
  base: '/nefis',

  integrations: [
		starlight({
		title: 'Nefis Docs',
		customCss: ['./src/styles/global.css'],
		social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/withastro/starlight' }],
		plugins: [
			starlightRosePine(),
			starlightSidebarTopics([
			{
				label: 'Brand Operating System',
				link: '/ingredientes-estrategicos/',
				icon: 'open-book',
				items: [{ autogenerate: { directory: 'ingredientes-estrategicos' } }],
			},
			{
				label: 'Creative Translation System',
				link: '/ingredientes-creativos/',
				icon: 'pencil',
				items: [{ autogenerate: { directory: 'ingredientes-creativos' } }],
			},
			]),
		],
		}),
	],

  vite: {
    plugins: [tailwindcss()],
  },
});