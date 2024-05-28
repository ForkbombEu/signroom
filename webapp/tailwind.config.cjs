const config = {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
	],

	plugins: [require('flowbite/plugin')],

	darkMode: 'class',

	theme: {
		extend: {
			fontFamily: {
				sans: ['Inter Variable', 'sans-serif']
			},
			colors: {
				primary: {
					50: '#fbf4ff',
					100: '#f4e5ff',
					200: '#ebd0ff',
					300: '#dcacff',
					400: '#c776ff',
					500: '#b242ff',
					600: '#a223ff',
					700: '#8a0ee2',
					800: '#7512b7',
					900: '#601093',
					950: '#42006f'
				}
			}
		}
	}
};

module.exports = config;
