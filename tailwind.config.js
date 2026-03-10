/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./public/**/*.html"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#2563eb",
          dark: "#1e40af"
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
