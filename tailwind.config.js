/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#3157E8', // Core Primary
          600: '#2444C5', // Dark
          700: '#1D369F',
          800: '#162978',
          900: '#0F1C52',
          950: '#0A1236',
        },
        surface: '#FFFFFF',
        canvas: '#F7F8FC',
        content: {
          primary: '#15171C',
          secondary: '#686D78',
          muted: '#9CA3AF',
        },
        feedback: {
          success: '#1F9D68',
          warning: '#E9A23B',
          error: '#D94B4B',
          info: '#3B82F6',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        'card': '16px',
        'btn': '12px',
        'input': '12px',
        'sheet': '24px',
        'modal': '20px',
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(21, 23, 28, 0.06), 0 2px 6px -1px rgba(21, 23, 28, 0.04)',
        'card-hover': '0 12px 32px -4px rgba(49, 87, 232, 0.12), 0 4px 12px -2px rgba(21, 23, 28, 0.06)',
        'floating': '0 20px 40px -6px rgba(15, 28, 82, 0.16)',
        'sheet': '0 -10px 40px rgba(15, 28, 82, 0.1)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
      }
    },
  },
  plugins: [],
}
