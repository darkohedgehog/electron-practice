/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ["class"],
	content: [
	  "./index.html",
	  "./src/**/*.{js,ts,jsx,tsx,css}"
	],
	safelist: [
	  'bg-background',
	  'text-foreground'
	],
	theme: {
	  extend: {
		colors: {
		  border: 'hsl(var(--sidebar-border))',
		  sidebar: {
			DEFAULT: 'hsl(var(--sidebar-background))',
			foreground: 'hsl(var(--sidebar-foreground))',
			primary: 'hsl(var(--sidebar-primary))',
			'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
			accent: 'hsl(var(--sidebar-accent))',
			'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
			border: 'hsl(var(--sidebar-border))',
			ring: 'hsl(var(--sidebar-ring))'
		  },
		  background: 'hsl(var(--background))',
		  foreground: 'hsl(var(--foreground))',
		      dark: "#1b1b1b",
			  light: "#fff",
			  accent: "#4F5D75",
			  accentDark: "#7A9CC6",
			  gray: "#747474",
			  darkblue: '#0a192f',
			  darkpurple: '#564592',
			  'card-bg-light': '#e4d9ff',
			  'card-bg-dark': '#011638',
		}
	  }
	},
	plugins: [require("tailwindcss-animate")],
  };
  