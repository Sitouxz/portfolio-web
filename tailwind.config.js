/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#f7f9fb',
        surface: '#f7f9fb',
        'surface-bright': '#f7f9fb',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f2f4f6',
        'surface-container': '#eceef0',
        'surface-border': '#e2e8f0',
        'on-background': '#191c1e',
        'on-surface': '#191c1e',
        primary: '#95002a',
        'primary-fixed': '#ffdadb',
        'primary-container': '#be123c',
        'on-primary': '#ffffff',
        secondary: '#565e74',
        'slate-400': '#94a3b8',
        'slate-600': '#475569',
        'slate-900': '#0f172a',
      },
      fontFamily: {
        burtons: 'burtons',
        body: ['Inter', 'sans-serif'],
        display: ['Geist', 'sans-serif'],
      },
      maxWidth: {
        container: '1200px',
      },
      boxShadow: {
        ambient: '0 20px 50px -24px rgba(15, 23, 42, 0.22)',
      },
    },
  },
  plugins: [],
};
