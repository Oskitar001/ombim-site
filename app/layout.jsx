// app/layout.js
export const metadata = {
  title: "OMBIM",
  description: "Modelado 3D y software para Tekla Structures"
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
