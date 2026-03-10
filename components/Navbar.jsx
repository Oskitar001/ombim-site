import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full py-4 bg-white shadow">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6">

        {/* LOGO + TEXTO (todo clicable) */}
        <Link href="/" className="flex items-center gap-4">
          <img
            src="/logo-ombim.png"
            alt="OMBIM Logo"
            className="h-16 w-auto transition-transform duration-300 hover:scale-105 hover:opacity-90"
          />
          <span className="text-3xl font-bold">OMBIM</span>
        </Link>

        {/* MENÚ */}
        <div className="flex gap-6 text-lg">
          <Link href="/" className="hover:text-blue-600 transition">Inicio</Link>
          <Link href="/sobre-mi" className="hover:text-blue-600 transition">Sobre mí</Link>
          <Link href="/servicios" className="hover:text-blue-600 transition">Servicios</Link>
          <Link href="/demos" className="hover:text-blue-600 transition">Demos</Link>
          <Link href="/contacto" className="hover:text-blue-600 transition">Contacto</Link>
        </div>
      </div>
    </nav>
  );
}
