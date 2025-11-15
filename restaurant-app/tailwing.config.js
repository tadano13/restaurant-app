/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors'); // Import colors

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Replaces blue-600
        primary: colors.emerald,
        // Replaces gray-900
        'admin-dark': colors.slate[900],
        // Replaces gray-50 / gray-100
        'app-bg': colors.zinc[50],
        // For accents
        accent: colors.amber,
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
