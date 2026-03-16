import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata = {
  title: "OMBIM",
  description: "Modelado 3D y software para Tekla Structures"
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head />
      <body className="pt-20 bg-white dark:bg-[#111] text-gray-900 dark:text-gray-100 transition-colors">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
