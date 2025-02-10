import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			colors: {
				primary: {
					DEFAULT: '#4690FF',
					hover: '#2F80FF'
				},
				secondary: {
					DEFAULT: '#CCCCCC',
					hover: '#B3B3B3'
				},
				wide: { DEFAULT: '#80DEEA' },
				narrow: { DEFAULT: '#F48FB1' }
			}
		}
	},

	plugins: []
} as Config;
