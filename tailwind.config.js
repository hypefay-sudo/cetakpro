/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#07111f',
          900: '#0b1728',
          800: '#102033',
          700: '#18314f',
        },
        brand: {
          50: '#eef7ff',
          100: '#d9edff',
          500: '#2563eb',
          600: '#1d4ed8',
          700: '#1e40af',
        },
        success: {
          50: '#edfdf5',
          500: '#10b981',
          600: '#059669',
        },
      },
      boxShadow: {
        soft: '0 14px 40px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [],
};
