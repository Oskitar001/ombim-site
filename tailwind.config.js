/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./public/**/*.html"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#2563eb",
          dark: "#1e40af"
        },

        // 🌑 Modo oscuro premium (más claro, visible)
        dark: {
          bg: "#242424",
          bgSoft: "#2e2e2e",
          border: "#3a3a3a",
          text: "#e6e6e6"
        },

        // ☀️ Modo claro premium (más suave)
        light: {
          bg: "#f3f4f6",
          bgSoft: "#ffffff",
          border: "#d1d5db",
          text: "#1f2937"
        }
      },

      boxShadow: {
        soft: "0 4px 20px rgba(0,0,0,0.08)",
        "soft-hover": "0 6px 28px rgba(0,0,0,0.12)"
      }
    }
  },
  plugins: []
};
