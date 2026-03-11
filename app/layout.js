import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata = {
  title: "Óscar Martínez | Tekla Specialist",
  description: "Modelado, planos y automatizaciones en Tekla Structures.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="pt-28 bg-gray-50">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
