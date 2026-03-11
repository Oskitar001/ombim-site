import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full py-4 bg-white shadow">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6">

        {/* LOGO + TEXTO (todo clicable) */}
        <a href="/" className="flex items-center gap-3 shrink-0">
          <img
            src="/logo-ombim.png"
            alt="OMBIM Logo"
            className="h-10 w-auto md:h-16 transition-transform duration-300 hover:scale-105 hover:opacity-90"
          />
          <span className="text-xl md:text-3xl font-bold whitespace-nowrap">
            OMBIM
          </span>
        </a>

        {/* MENÚ */}
        <div className="flex gap-4 md:gap-6 text-base md:text-lg">
          <a href="/" className="hover:text-blue-600 transition">Inicio</a>
          <Link href="/sobre-mi" className="hover:text-blue-600 transition">Sobre mí</Link>
          <Link href="/servicios" className="hover:text-blue-600 transition">Servicios</Link>
          <Link href="/demos" className="hover:text-blue-600 transition">Demos</Link>
          <Link href="/contacto" className="hover:text-blue-600 transition">Contacto</Link>
        </div>
      </div>
    </nav>
  );
}
