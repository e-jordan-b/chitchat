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
      colors: {
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
          '50': '#EEF2FF',

        }
      },
      screens: {
        'custom': '900px',
      },
      keyframes: {
        skeletonLoading: {
          '0%': { backgroundColor: 'custom-purple-400' },
          '50%': { backgroundColor: 'custom-purple-300' },
          '100%': { backgroundColor: 'custom-purple-400' },
        }
      },
      animation: {
        skeleton: 'skeletonLoading 1.5s ease-in-out infinite',
      },
    },

  },
  plugins: [],
}