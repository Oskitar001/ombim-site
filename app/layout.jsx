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
      <body
        className="
          pt-20
          bg-[#f3f4f6] text-[#1f2937]
          dark:bg-[#242424] dark:text-[#e6e6e6]
          transition-colors duration-300
          min-h-screen
          flex flex-col
        "
      >
        <Navbar />

        <main className="flex-1 px-4 md:px-6 lg:px-8">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
