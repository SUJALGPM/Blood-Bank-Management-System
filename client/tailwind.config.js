/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'], // Custom keyword for Inter
        viga: ['Viga', 'sans-serif'],   // Custom keyword for Viga
      },
    },
  },
  plugins: [],
};

