/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      colors: {
        brand: {
          50: '#f4f4f5',
          100: '#e4e4e7',
          900: '#18181b', // pure dark zinc
          accent: '#0070F3', // Vercel blue
        }
      },
      boxShadow: {
        'geist': '0 2px 8px 0 rgba(0,0,0,0.04), 0 1px 2px 0 rgba(0,0,0,0.02)',
        'geist-hover': '0 8px 30px rgba(0,0,0,0.12)',
        'float': '0 0 0 1px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.05)',
      }
    },
  },
  plugins: [],
}
