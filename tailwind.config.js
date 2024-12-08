/** @type {import('tailwindcss').Config} */
export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#906D22',
        secondary: '#FBB626',
        tertiary: '#DC641F',
        quaternary: '#983712',
        dark: '#3F1A0B',
        'ui-light': '#F5F3F0',
        'ui-dark': '#2A2520',
        accent: '#2D7D76',
      },
      gradientColorStops: theme => ({
        ...theme('colors'),
      }),
      backgroundColor: theme => ({
        ...theme('colors'),
      }),
      textColor: theme => ({
        ...theme('colors'),
      }),
      borderColor: theme => ({
        ...theme('colors'),
      }),
    },
  },
  plugins: [],
} 