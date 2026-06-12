/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors (logo-inspired)
        primary: {
          DEFAULT: '#d4af37',
          light: '#f2cf63',
          dark: '#a38322',
        },
        secondary: {
          DEFAULT: '#111111',
          light: '#1f1f1f',
        },

        // Neutral light system
        background: '#ffffff',
        surface: '#f8fafc',
        border: '#e2e8f0',

        // Text scale
        text: {
          primary: '#111111',
          secondary: '#374151',
          muted: '#6b7280',
        },

        // Backward-compatible aliases for a Light Premium Theme
        dark: '#f8fafc',         // Off-white / slate-50 for main background
        'dark-light': '#ffffff', // Pure white for cards/surfaces
        'dark-lighter': '#ffffff',
        grey: '#475569',         // slate-600
        'grey-light': '#64748b',   // slate-500
        'grey-dark': '#e2e8f0',    // slate-200 for borders
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}