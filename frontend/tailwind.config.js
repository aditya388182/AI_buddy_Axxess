/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#0a66c2",
        "background-light": "#f5f7f8",
        "background-dark": "#101922",
      },
    },
  },
  plugins: [],
}