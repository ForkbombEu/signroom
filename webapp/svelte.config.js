import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter(),
		alias: {
			$paraglide: './src/paraglide',
			'@api': './src/routes/api',
			'@zenflows-crypto': './zenflows-crypto',
			'@client-zencode': './client-zencode'
		},
		version: {
			name: process.env.npm_package_version
		}
	}
};

export default config;
