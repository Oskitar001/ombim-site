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
        dark: {
          bg: "#1a1a1a",
          bgSoft: "#222222",
          border: "#333333",
          text: "#e5e5e5"
        },
        light: {
          bg: "#f8f9fa",
          bgSoft: "#ffffff",
          border: "#e5e7eb",
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
}
