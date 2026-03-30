// PanelWrapper.jsx

"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function PanelWrapper({ children }) {
  const pathname = usePathname();
  const isPanel = pathname?.startsWith("/panel");

  return (
    <>
      {/* NAVBAR: siempre visible */}
      {isPanel ? (
        <Navbar className="shadow-none border-b-0" />
      ) : (
        <Navbar />
      )}

      {/* CONTENIDO Ajustado al tamaño REAL del navbar fijo */}
      <div
        className={
          isPanel
            ? "pt-20 md:pt-[72px] bg-[#f3f4f6] dark:bg-[#242424] min-h-screen"
            : "pt-20 md:pt-[72px] min-h-screen"
        }
      >
        {children}
      </div>

      {/* Footer solo en páginas públicas */}
      {!isPanel && <Footer />}
    </>
  );
}