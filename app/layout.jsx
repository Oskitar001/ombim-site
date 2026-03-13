import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "OMBIM",
  description: "Modelado 3D, automatizaciones y software para Tekla Structures"
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
