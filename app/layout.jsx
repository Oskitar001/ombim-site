import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RevealObserver from "../components/RevealObserver";

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-[88px]">
          <RevealObserver />
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
