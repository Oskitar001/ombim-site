export default function Footer() {
  return (
    <footer className="mt-32 bg-gray-900 text-gray-300 py-14">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10">

        {/* LOGO + DESCRIPCIÓN */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-3">OMBIM</h3>
          <p className="text-gray-400 leading-relaxed">
            Automatizaciones, plugins y software a medida para Tekla Structures.
            Aceleramos tu flujo BIM con soluciones profesionales.
          </p>
        </div>

        {/* ENLACES RÁPIDOS */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Navegación</h4>
          <ul className="space-y-2">
            <li><a href="/" className="hover:text-white transition">Inicio</a></li>
            <li><a href="/sobre-mi" className="hover:text-white transition">Sobre mí</a></li>
            <li><a href="/servicios" className="hover:text-white transition">Servicios</a></li>
            <li><a href="/demos" className="hover:text-white transition">Demos</a></li>
            <li><a href="/contacto" className="hover:text-white transition">Contacto</a></li>
          </ul>
        </div>

        {/* CONTACTO */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Contacto</h4>
          <ul className="space-y-2">
            <li className="text-gray-400">📧 info@ombim.com</li>
            <li className="text-gray-400">📍 España</li>
          </ul>

          {/* REDES SOCIALES (opcional) */}
          <div className="flex gap-4 mt-4">
            <a href="#" className="hover:opacity-80 transition text-xl">🔗</a>
            <a href="#" className="hover:opacity-80 transition text-xl">🔗</a>
            <a href="#" className="hover:opacity-80 transition text-xl">🔗</a>
          </div>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="text-center text-gray-500 text-sm mt-10 border-t border-gray-700 pt-6">
        © {new Date().getFullYear()} OMBIM — Todos los derechos reservados.
      </div>
    </footer>
  );
}
