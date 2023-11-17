/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
    "docs/content/**/*.md"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#076b99'
      },
    },
  },
  plugins: [],
}