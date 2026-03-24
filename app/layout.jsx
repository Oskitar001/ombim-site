// app/layout.jsx
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata = {
  title: "OMBIM",
  description: "Modelado 3D y software para Tekla Structures",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}