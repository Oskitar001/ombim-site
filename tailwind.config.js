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
        // 🎨 Marca OMBIM
        brand: {
          DEFAULT: "#2563eb", // azul principal (igual a Tailwind blue-600)
          dark: "#1e40af",    // azul más oscuro
          light: "#60a5fa",
        },

        // 🎨 Fondo "Soft" personalizado (aparece mucho en tu código)
        "light-bg": "#f3f4f6",
        "light-bgSoft": "#f9fafb",
        "dark-bg": "#242424",
        "dark-bgSoft": "#1a1a1a",

        // Alias para compatibilidad con clases personalizadas (bg-[#f3f4f6]Soft)
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
