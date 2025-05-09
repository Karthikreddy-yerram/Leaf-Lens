import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: { height: '0' },
  				to: { height: 'var(--radix-accordion-content-height)' }
  			},
  			'accordion-up': {
  				from: { height: 'var(--radix-accordion-content-height)' },
  				to: { height: '0' }
  			},
  			'float': {
  				'0%': { transform: 'translateY(0px)' },
  				'50%': { transform: 'translateY(-10px)' },
  				'100%': { transform: 'translateY(0px)' }
  			},
  			'pulse-glow': {
  				'0%': { boxShadow: '0 0 0 0 rgba(22, 163, 74, 0.4)' },
  				'70%': { boxShadow: '0 0 0 10px rgba(22, 163, 74, 0)' },
  				'100%': { boxShadow: '0 0 0 0 rgba(22, 163, 74, 0)' }
  			},
  			'shimmer': {
  				'0%': { backgroundPosition: '-468px 0' },
  				'100%': { backgroundPosition: '468px 0' }
  			},
  			'spin-slow': {
  				'0%': { transform: 'rotate(0deg)' },
  				'100%': { transform: 'rotate(360deg)' }
  			},
  			'blob': {
  				'0%': { transform: 'translate(0px, 0px) scale(1)' },
  				'33%': { transform: 'translate(30px, -30px) scale(1.1)' },
  				'66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
  				'100%': { transform: 'translate(0px, 0px) scale(1)' }
  			},
  			'blob-slow': {
  				'0%': { transform: 'translate(0px, 0px) scale(1)' },
  				'33%': { transform: 'translate(20px, -10px) scale(1.05)' },
  				'66%': { transform: 'translate(-15px, 10px) scale(0.95)' },
  				'100%': { transform: 'translate(0px, 0px) scale(1)' }
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'float': 'float 6s ease-in-out infinite',
  			'pulse-glow': 'pulse-glow 2s infinite',
  			'shimmer': 'shimmer 2s infinite linear',
  			'spin-slow': 'spin-slow 10s linear infinite',
  			'blob': 'blob 7s infinite',
  			'blob-slow': 'blob-slow 12s infinite'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
