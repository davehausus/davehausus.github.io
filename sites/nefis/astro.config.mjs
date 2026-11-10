const auto = (label, directory, extra = {}) => ({
  label,
  items: [{ autogenerate: { directory } }],
  ...extra,
});

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
		title: 'Nefis',
		customCss: ['./src/styles/global.css'],
		social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/withastro/starlight' }],
		defaultLocale: 'root',
		locales: {
			root: {
			label: 'Español',
			lang: 'es',
			},
		},
		plugins: [
			starlightRosePine(),
			starlightSidebarTopics([
			{
				label: 'Ingredientes Estratégicos',
				link: '/ingredientes-estrategicos/',
				icon: 'open-book',
				items: [
					auto('Parte I', 'ingredientes-estrategicos/parte-i'),
    				auto('Parte II', 'ingredientes-estrategicos/parte-ii'),
    				auto('Parte III', 'ingredientes-estrategicos/parte-iii'),
    				auto('Parte IV', 'ingredientes-estrategicos/parte-iv'),
					auto('Parte V', 'ingredientes-estrategicos/parte-v'),
				],
			},
			{
				label: 'Creative Translation System',
				link: '/ingredientes-creativos/',
				icon: 'pencil',
				items: [{ autogenerate: { directory: 'ingredientes-creativos' } }],
			},
			],
			{
			    exclude: ['/bienvenida', '/bienvenida/**/*'],
			},
			),
		],
		}),
	],

  vite: {
    plugins: [tailwindcss()],
  },
});