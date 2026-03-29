"use client";

import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { usePathname } from "next/navigation";

export const metadata = {
  title: "OMBIM",
  description: "Modelado 3D y software para Tekla Structures",
};

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // Detectar si estamos en cualquier ruta del panel
  const isPanel = pathname?.startsWith("/panel");

  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`bg-gray-100 dark:bg-[#1b1f24] text-gray-900 dark:text-gray-100 transition-colors ${
          isPanel ? "" : "pt-20"
        }`}
      >
        {/* NAVBAR solo si NO estamos en panel */}
        {!isPanel && <Navbar />}

        <main className="min-h-screen">{children}</main>

        {/* FOOTER solo si NO estamos en panel */}
        {!isPanel && <Footer />}
      </body>
    </html>
  );
}