/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        "rcb-gold": "rgb(173, 161, 93)",
        "rcb-black": "#0a0a0a",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        impact: ["Impact", "Haettenschweiler", "Arial Narrow Bold", "sans-serif"],
      },
    },
  },
  plugins: [],
};
