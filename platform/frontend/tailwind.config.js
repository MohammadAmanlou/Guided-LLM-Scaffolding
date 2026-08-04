const rtl = require('tailwindcss-rtl');

module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        vazirmatn: ['Vazirmatn', 'sans-serif'],
        iransans: ['IRANSans', 'sans-serif'],
        tahoma: ['Tahoma', 'sans-serif'],
      },
    },
  },
  plugins: [rtl],
};

