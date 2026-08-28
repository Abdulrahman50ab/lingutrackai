/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1', // Primary Electric Indigo
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
          950: '#1E1B4B',
        },
        urdu: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981', // Emerald for Urdu highlight
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },
        dark: {
          bg: '#0B0F19',
          card: '#111827',
          surface: '#1F2937',
          border: '#374151',
          hover: '#283548',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        urdu: ['"Noto Nastaliq Urdu"', 'Gulzar', 'sans-serif'],
        mono: ['"Fira Code"', 'monospace'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'wave-bar': 'waveBar 1.2s ease-in-out infinite alternate',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        waveBar: {
          '0%': { height: '15%' },
          '100%': { height: '100%' },
        },
        glow: {
          '0%': { boxShadow: '0 0 10px rgba(99, 102, 241, 0.3)' },
          '100%': { boxShadow: '0 0 25px rgba(99, 102, 241, 0.7)' },
        }
      }
    },
  },
  plugins: [],
}
