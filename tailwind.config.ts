import type { Config } from "tailwindcss";
import { tailwindColors, colorWithOpacity, statusColors, textColors } from "./lib/constants/colors";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	container: {
  		center: true,
  		padding: "2rem",
  		screens: {
  			"2xl": "1400px",
  		},
  	},
  	extend: {
  		colors: {
  			...tailwindColors,
  			...colorWithOpacity,
  			...statusColors,
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))',
  			},
  		},
  		textColor: {
  			// Primary text variations
  			primary: textColors.primary,
  			secondary: textColors.secondary,
  			tertiary: textColors.tertiary,
  			
  			// Muted text variations
  			'primary-muted': textColors.primaryMuted,
  			'secondary-muted': textColors.secondaryMuted,
  			'tertiary-muted': textColors.tertiaryMuted,
  			
  			// Special text colors
  			heading: textColors.heading,
  			body: textColors.body,
  			muted: textColors.muted,
  			disabled: textColors.disabled,
  			
  			// Interactive text colors
  			hover: textColors.hover,
  			active: textColors.active,
  			link: textColors.link,
  			'link-hover': textColors.linkHover,
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			"accordion-down": {
  				from: { height: "0" },
  				to: { height: "var(--radix-accordion-content-height)" },
  			},
  			"accordion-up": {
  				from: { height: "var(--radix-accordion-content-height)" },
  				to: { height: "0" },
  			},
  			"animate-in": {
  				"0%": {
  					opacity: "0",
  					transform: "scale(0.95)",
  				},
  				"100%": {
  					opacity: "1",
  					transform: "scale(1)",
  				},
  			},
  		},
  		animation: {
  			"accordion-down": "accordion-down 0.2s ease-out",
  			"accordion-up": "accordion-up 0.2s ease-out",
  			"animate-in": "animate-in 0.2s ease-out",
  		},
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
