/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}", "./popup.html"],
  theme: {
    extend: {},
  },
  plugins: [
    require("flowbite/plugin"),
  ],
  darkMode: "class",
};

