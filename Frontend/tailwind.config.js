/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-200": "#ffbf00",
        "primary-100": "#ffbf00",
        "secondary-200": "#00b050",
        "secondary-100": "#00a050",
      }
    },
  },
  plugins: [],
}