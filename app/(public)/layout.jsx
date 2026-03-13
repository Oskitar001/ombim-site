export default function PublicLayout({ children }) {
  return (
    <>
      {/* CABECERA */}
      <header className="w-full py-6 bg-white shadow-sm fixed top-0 left-0 z-50">
        <div className="container mx-auto flex justify-between items-center px-6">
          <a href="/" className="text-2xl font-bold text-gray-900">
            OMBIM
          </a>

          <nav className="flex gap-6 text-gray-700 font-medium">
            <a href="/contacto" className="hover:text-blue-600 transition">Contacto</a>
            <a href="/admin/login" className="hover:text-blue-600 transition">Acceso</a>
          </nav>
        </div>
      </header>

      {/* CONTENIDO */}
      <div className="pt-24">{children}</div>

      {/* PIE DE PÁGINA */}
      <footer className="mt-20 py-10 bg-gray-900 text-gray-300">
        <div className="container mx-auto text-center">
          <p className="text-sm">© {new Date().getFullYear()} OMBIM — Todos los derechos reservados</p>
        </div>
      </footer>
    </>
  );
}
