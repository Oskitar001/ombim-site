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
      {/* Mostrar el navbar SIEMPRE, 
          pero si es panel → sin sombra ni borde */}
      {isPanel ? (
        <Navbar className="shadow-none border-b-0" />
      ) : (
        <Navbar />
      )}

      {/* Espacio arriba para que el contenido no quede TAPADO por el navbar */}
      <div className={isPanel ? "pt-20 md:pt-24 bg-[#f3f4f6] dark:bg-[#242424]" : ""}>
        {children}
      </div>

      {!isPanel && <Footer />}
    </>
  );
}