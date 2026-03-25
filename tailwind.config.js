/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 🎨 OMBIM BRAND — Menos azul fosforito
        brand: {
          DEFAULT: "#1f4fd8",  // azul elegante, NO fosforito
          dark: "#1a3ca0",
          light: "#7295ff",
        },

        // 🎨 Fondos
        "light-bg": "#f3f4f6",
        "light-bgSoft": "#f9fafb",
        "dark-bg": "#1f1f1f",
        "dark-bgSoft": "#131313",

        soft: {
          light: "#f3f4f6",
          dark: "#1a1a1a",
        },
      },

      boxShadow: {
        soft: "0 2px 8px rgba(0,0,0,0.05)",
        "soft-hover": "0 4px 12px rgba(0,0,0,0.08)",
      },

      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};