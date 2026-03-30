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
      {/* NAVBAR:
          - En panel: ocultar en móvil (md:block), mostrar sólo escritorio.
          - Fuera del panel: mostrar siempre. */}
      {isPanel ? (
        <Navbar className="hidden md:block shadow-none border-b-0" />
      ) : (
        <Navbar />
      )}

      {/* Contenido principal.
         Ajustado al navbar SOLO si está visible. */}
      <div
        className={
          isPanel
            ? "pt-4 md:pt-[72px] bg-[#f3f4f6] dark:bg-[#242424] min-h-screen"
            : "pt-[72px] min-h-screen"
        }
      >
        {children}
      </div>

      {!isPanel && <Footer />}
    </>
  );
}