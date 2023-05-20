import { type Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{js,ts,jsx,tsx}'],
	darkMode: 'class',
	theme: {
		screens: {
			mn: '320px',
			xs: '575px',
			sm: '640px',
			md: '768px',
			'2md': '991px',
			lg: '1024px',
			xl: '1280px',
			'2xl': '1280px',
			'3xl': '1449px'
		},
		container: {
			center: true,
			padding: '2rem'
		},
		extend: {
			fontFamily: {
				roboto: "'Roboto', sans-serif"
			}
		}
	},
	plugins: [require('tailwindcss-animate')]
} satisfies Config;
