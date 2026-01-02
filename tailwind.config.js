/**
 * Tailwind CSS v3 Configuration for Urban-Move
 */

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1B5E20',
          light: '#4CAF50',
          dark: '#0D3D12',
        },
        secondary: {
          DEFAULT: '#FF6F00',
          light: '#FFA040',
        },
        metro: '#E53935',
        orangeLine: '#FF6F00',
        bus: '#2196F3',
        confidence: {
          high: '#2E7D32',
          medium: '#F9A825',
          low: '#C62828',
        },
      },
    },
  },
  plugins: [],
};
