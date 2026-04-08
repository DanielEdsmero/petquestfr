/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0f0f1a',
        secondary: '#1a1a2e',
        accent: '#7c6df0',
        card: '#1e1e2e',
        muted: '#a0a0b8'
      },
      borderRadius: {
        xl: '12px'
      },
      transitionDuration: {
        200: '200ms'
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
};
