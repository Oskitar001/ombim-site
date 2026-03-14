/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
  },

  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,

  turbopack: {
    root: __dirname,
  },
};

module.exports = nextConfig;
