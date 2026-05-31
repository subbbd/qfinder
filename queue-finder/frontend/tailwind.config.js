/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#F97316',
          'orange-dark': '#EA580C',
          'orange-light': '#FED7AA',
          black: '#0A0A0A',
          'black-soft': '#1A1A1A',
          'black-card': '#222222',
          red: '#DC2626',
          'red-dark': '#B91C1C',
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
