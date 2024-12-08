/** @type {import('tailwindcss').Config} */
export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Brand Colors
        primary: {
          DEFAULT: '#906D22',
          dark: '#785A1C',
        },
        secondary: '#FBB626',
        tertiary: '#DC641F',
        quaternary: '#983712',
        
        // UI Colors
        ui: {
          light: '#F5F3F0',
          dark: '#2A2520',
        },
        
        // Text Colors
        text: {
          primary: '#3F1A0B',
          secondary: '#2A2520',
          muted: 'rgba(42, 37, 32, 0.6)',
        },
        
        // Status Colors
        status: {
          success: '#2D7D76',
          error: '#983712',
          warning: '#DC641F',
        },
      },
      fontFamily: {
        serif: ['Cormorant', 'serif'],
        display: ['Cormorant', 'serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1.16' }],
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