/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'tv-bg': '#131722',
        'tv-bg-secondary': '#1e222d',
        'tv-bg-tertiary': '#2a2e39',
        'tv-border': '#363a45',
        'tv-text': '#d1d4dc',
        'tv-text-secondary': '#787b86',
        'tv-blue': '#2962ff',
        'tv-blue-light': '#5b9cf6',
        'tv-green': '#26a69a',
        'tv-green-light': '#4caf50',
        'tv-red': '#ef5350',
        'tv-red-dark': '#ff5252',
        'tv-yellow': '#ffeb3b',
        'tv-orange': '#ff9800',
        'tv-purple': '#7c4dff',
      },
      fontFamily: {
        'trading': ['Trebuchet MS', 'Roboto', 'Ubuntu', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
