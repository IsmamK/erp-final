/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui"

export default {
  darkMode: 'selector', // Enable dark mode with a class
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    daisyui,
    
  ],
}