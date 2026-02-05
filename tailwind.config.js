/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./libs/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        satoshi: ["Satoshi", "Inter", "system-ui", "sans-serif"]
      },
      boxShadow: {
        soft: "0 20px 60px rgba(0,0,0,0.06)"
      }
    }
  },
  plugins: []
};
