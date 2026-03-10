// app/layout.jsx

export const metadata = {
  title: "OMBIM · Tekla Structures & Automatizaciones BIM",
  description:
    "Especialistas en Tekla Structures, automatizaciones BIM y desarrollo de software a medida para ingenierías y constructoras.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        {/* Preconnect correcto para Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />

        {/* Eliminado el preload incorrecto de Inter local */}
        {/* Ya no intenta cargar /fonts/Inter-VariableFont.woff2 */}
      </head>

      <body>{children}</body>
    </html>
  );
}
