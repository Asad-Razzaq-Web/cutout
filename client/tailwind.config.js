/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['"Hanken Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        prose: ['Literata', 'Georgia', 'serif'],
      },
      colors: {
        paper: { DEFAULT: '#EEF1F0', panel: '#FFFFFF', line: '#D5DBD9' },
        night: { DEFAULT: '#0C1210', panel: '#141D1A', line: '#25322E' },
        ink: { DEFAULT: '#12201B', soft: '#52615B' },
        mist: { DEFAULT: '#E8EFEC', soft: '#93A29B' },
        cobalt: { DEFAULT: '#2447F5', light: '#8FA6FF', deep: '#1A34BD' },
      },
      keyframes: {
        sweep: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: { sweep: 'sweep 1.4s ease-in-out infinite' },
    },
  },
  plugins: [],
};
