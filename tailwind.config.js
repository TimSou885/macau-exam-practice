/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef7f4',
          100: '#d6ede5',
          200: '#b1ddce',
          300: '#7fc5af',
          400: '#4da68d',
          500: '#2d8a73',
          600: '#216e5d',
          700: '#1c594c',
          800: '#1a483f',
          900: '#193c35',
        },
        accent: {
          gold: '#c9a227',
          red: '#c53030',
        },
      },
      fontFamily: {
        sans: ['"Noto Sans TC"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
