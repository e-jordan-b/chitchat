/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    scale: {
      '30': '.30',
      '30-percent': '0.30'
    },
    extend: {
      height: {
        "h-18": "4.5rem"}
        ,
      colors: {
        'gradient-pink': '#E20BB8',
        'gradient-blue': '#2A87F9',
        'custom-purple': {
          "900": '#312E81',
          '800': '#3730A3',
          '700': '#4338CA',
          "600": '#4F46E5',
          '500': '#6366F1',
          '400': '#818CF8',
          "300": '#A5B4FC',
          '200': '#C7D2FE',
          '100': '#E0E7FF',
          '50': '#EEF2FF'
        },
        'background-black-call' : '#202124'
      }
    },
  },
  plugins: [],
}