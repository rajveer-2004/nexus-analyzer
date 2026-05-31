/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Geist', 'system-ui', 'arial'],
        mono: ['"Geist Mono"', 'monospace'],
      },
      colors: {
        zampBlue: '#005eff',
        background: '#f5f3f8',
        heroBackground: '#fdfdfd',
        bodyColor: '#EFEFEF',
        creamNeutral: '#f3f2ef',
        componentBackground: '#171717',
        border200: '#d9d9d9',
        gray350: '#ededed',
        gray450: '#edf4ff',
        gray550: '#629cff',
        gray650: '#888',
        darkBg: '#0d0d1a',
      }
    },
  },
  plugins: [],
}
