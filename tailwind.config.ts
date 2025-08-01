import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2A72C4',
        gradientStart: '#1DE9B6',
        gradientEnd: '#2979FF',
        amberGlow: '#FDBA74',
        background: '#F5F5F5',
        dark: '#1F2937',
      },
      fontFamily: {
        sans: ['"AXIS Extra Bold Regular"', 'Inter', 'sans-serif'],
        'dm-serif': ['var(--font-dm-serif)', 'serif'],
        nunito: ['var(--font-nunito)', 'Nunito', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        playfair: ['var(--font-playfair)', 'Playfair Display', 'Times New Roman', 'serif'],
      },
      boxShadow: {
        card: '0 10px 15px rgba(0, 0, 0, 0.1)',
        glow: '0 0 20px rgba(253, 186, 116, 0.3)',
        'luxury': '0 20px 40px rgba(0, 0, 0, 0.3)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #1DE9B6 0%, #2979FF 100%)',
        'gradient-hero': 'linear-gradient(135deg, #1DE9B6 0%, #2979FF 50%, #2A72C4 100%)',
      },
    },
  },
  plugins: [],
}
export default config 