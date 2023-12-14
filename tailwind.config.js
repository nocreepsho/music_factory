/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        satoshi: ['Satoshi', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        'primary-orange': '#FF5722',
        'olive_green': '#435334',
        'darker_leaf_green': '#9EB384',
        'leaf_green': '#b1c29d',
        'beige': '#FAF1E4',
        'brown': '#765038'
      },
      transitionProperty: {
        'height': 'height',
      },
    },
  },
  plugins: [],
}