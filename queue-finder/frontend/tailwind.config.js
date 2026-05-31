/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#1A73E8',
          'blue-dark': '#1557B0',
          'blue-light': '#4285F4',
          'blue-muted': '#1A73E820',
          black: '#202124',
          'black-soft': '#2D2E30',
          'black-card': '#3C3E40',
          'black-border': '#5F6368',
          red: '#EA4335',
          'red-dark': '#C5221F',
        },
        crowd: {
          quiet: '#22C55E',
          moderate: '#F59E0B',
          busy: '#DC2626',
          none: '#6B7280',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
