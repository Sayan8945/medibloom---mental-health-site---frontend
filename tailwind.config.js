/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'working-img' : "url('/work-proceess.webp')"
      },
      fontFamily: {
        'primary'   : ["DM Sans", "sans-serif"],
        'secondary' : ["Playfair Display", "serif"],
        'title'     : ["Bricolage Grotesque", "sans-serif"],
        'pacifico'  : ["Lora", "serif"],          // poem & quotes — warm serif
        'apple'     : ["Homemade Apple", "cursive"], // logo script
      },
      colors: {
        'heroBg' :  "#0e1122",
        'para':"rgb(0 0 0 / 80%)",
        'primary': '#06a055',
        'darkCard': '#1a1f35',   // survey/analytics card bg in dark mode
        'darkBg':   '#0b0e1a',   // survey/analytics page bg in dark mode
      }
    },
  },
  plugins: [],
}

