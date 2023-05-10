/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      width: {
        '6/7': '85.7142857%',
        '9/10': '90%',
        '9/20': '45%',
        '12/25': "48%",
      },
      height: {
        '6/7': '85.7142857%',
        '9/10': '90%',
        '9/20': '45%',
        '12/25': "48%",
     },
    },
  },
  plugins: [],
}