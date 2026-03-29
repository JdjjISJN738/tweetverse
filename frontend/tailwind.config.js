/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        twitter: "#1DA1F2",
        "twitter-bg": "#F8FAFC",
        "twitter-card": "#FFFFFF",
        "twitter-border": "#E2E8F0",
        "twitter-dark": "#0F1419"
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
