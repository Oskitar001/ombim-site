import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function PublicLayout({ children }) {
  return (
    <>
      {/* CABECERA */}
      <Navbar />

      {/* CONTENIDO PRINCIPAL */}
      <div className="pt-24">
        {children}
      </div>

      {/* PIE DE PÁGINA */}
      <Footer />
    </>
  );
}
