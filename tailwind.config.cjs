/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/tw-elements/dist/js/**/*.js"
  ],
  theme: {
    extend: {
      backgroundImage: {
        'church-sky': "url('/src/assets/img/church blue sky.jpg')",
      },
    },
  },
  plugins: [
    require("tw-elements/dist/plugin"),
    require('@tailwindcss/line-clamp'),
  ],
};
