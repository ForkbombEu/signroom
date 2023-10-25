const config = {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
	],

	plugins: [require('@tailwindcss/line-clamp'), require('flowbite/plugin')],

	darkMode: 'class',

	theme: {
		extend: {
			fontFamily: {
				sans: ['Inter Variable', 'sans-serif']
			},
			colors: {
				primary: {
					50: '#FFEDF2',
					100: '#FFE1EA',
					200: '#FFC2DA',
					300: '#FC94B3',
					400: '#F16C94',
					500: '#E44E7B',
					600: '#DC3768',
					700: '#C1305B',
					800: '#A0254A',
					900: '#761B36'
				}
			}
		}
	}
};

module.exports = config;
