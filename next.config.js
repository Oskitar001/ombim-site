/** @type {import('next').NextConfig} */
const nextConfig = {
  // Elimina el warning de "Cross origin request detected"
  allowedDevOrigins: ["http://192.168.1.54:3000"],

  // Optimización de imágenes
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
  },

  // Seguridad y rendimiento
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,

  // Asegura que Turbopack use esta carpeta como raíz
  turbopack: {
    root: __dirname,
  },
};

module.exports = nextConfig;
