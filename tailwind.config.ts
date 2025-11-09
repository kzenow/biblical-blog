import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        biblical: {
          sand: '#E8DCC4',
          parchment: '#F5EFE0',
          olive: '#6B7A52',
          burgundy: '#722F37',
          gold: '#D4AF37',
          deepBrown: '#3E2723',
          sage: '#9CAF88',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        biblical: ['Cinzel', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
export default config
