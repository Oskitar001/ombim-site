import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "OMBIM",
  description: "Página web de OMBIM"
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-gray-100 dark:bg-neutral-900 transition-colors">
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
