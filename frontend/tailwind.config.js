/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0a0a0a',
        card: '#141414',
        gold: '#C9A84C',
        'gold-hover': '#b8942e',
        primary: '#FFFFFF',
        secondary: '#888888',
        border: '#2a2a2a',
        'border-light': '#3a3a3a',
        success: '#22c55e',
        danger: '#ef4444',
        warning: '#f59e0b',
      },
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
        heading: ['Outfit', 'sans-serif'],
      },
      backgroundImage: {
        'hero-pattern': "url('/hero-bg.jpg')",
      },
    },
  },
  plugins: [],
}
