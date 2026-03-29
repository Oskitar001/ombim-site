"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function PanelWrapper({ children }) {
  const pathname = usePathname();
  const isPanel = pathname?.startsWith("/panel");

  return (
    <>
      {!isPanel && <Navbar />}
      <main className={isPanel ? "" : "pt-20"}>{children}</main>
      {!isPanel && <Footer />}
    </>
  );
}