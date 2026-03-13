import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-32 bg-gray-900 text-gray-300 py-14">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10">

        {/* LOGO + DESCRIPCIÓN */}
        <div>
          <h3 className="text-2xl font-bold text-black mb-3">OMBIM</h3>
          <p className="text-gray-400 leading-relaxed">
            Modelado 3D, automatizaciones, plugins y software a medida para Tekla Structures.
            Aceleramos tu flujo BIM con soluciones profesionales.
          </p>
        </div>

        {/* ENLACES RÁPIDOS */}
        <div>
          <h4 className="text-lg font-semibold text-black mb-4">Navegación</h4>
          <ul className="space-y-2">
            <li><Link href="/" className="hover:text-black transition">Inicio</Link></li>
            <li><Link href="/sobre-mi" className="hover:text-black transition">Sobre mí</Link></li>
            <li><Link href="/servicios" className="hover:text-black transition">Servicios</Link></li>
            <li><Link href="/demos" className="hover:text-black transition">Demos</Link></li>
            <li><Link href="/contacto" className="hover:text-black transition">Contacto</Link></li>
          </ul>
        </div>

        {/* CONTACTO */}
        <div>
          <h4 className="text-lg font-semibold text-black mb-4">Contacto</h4>
          <ul className="space-y-2">
            <li>
              <a
                href="mailto:o.martinez@ombim.com"
                className="text-gray-400 hover:text-black transition"
              >
                📧 o.martinez@ombim.com
              </a>
            </li>
            <li className="text-gray-400">📍 España</li>
          </ul>

          {/* REDES SOCIALES */}
          <div className="flex gap-5 mt-5">

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/search/results/all/?keywords=o.martinez%40ombim.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="transition text-gray-400 hover:text-[#0A66C2]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V24h-4V8zm7.5 0h3.8v2.2h.1c.5-1 1.8-2.2 3.8-2.2 4 0 4.7 2.6 4.7 6V24h-4v-8.2c0-2 0-4.5-2.8-4.5s-3.2 2.2-3.2 4.3V24h-4V8z"/>
              </svg>
            </a>

            {/* GitHub */}
            <a
              href="https://github.com/search?q=o.martinez%40ombim.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="transition text-gray-400 hover:text-black"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.1 3.29 9.43 7.86 10.96.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.55-3.87-1.55-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.73 1.27 3.4.97.1-.75.4-1.27.72-1.56-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.3 1.2-3.11-.12-.3-.52-1.52.11-3.17 0 0 .97-.31 3.18 1.19a11.1 11.1 0 0 1 5.8 0c2.2-1.5 3.17-1.19 3.17-1.19.63 1.65.23 2.87.11 3.17.75.81 1.2 1.85 1.2 3.11 0 4.43-2.69 5.4-5.25 5.68.41.36.77 1.08.77 2.18v3.23c0 .31.21.67.8.56A10.99 10.99 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5z"/>
              </svg>
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/34682288465"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="transition text-gray-400 hover:text-[#25D366] md:hover:text-[#25D366] md:hover:scale-110
                         md:transition-transform md:duration-300
                         md:text-gray-400
                         animate-[pulse_1.8s_ease-in-out_infinite] md:animate-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.52 3.48A11.86 11.86 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.11.55 4.17 1.6 5.98L0 24l6.2-1.63A12 12 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.19-3.48-8.52zM12 22c-1.8 0-3.55-.48-5.08-1.38l-.36-.21-3.68.97.98-3.59-.24-.37A9.94 9.94 0 0 1 2 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10zm5.2-7.3c-.28-.14-1.65-.82-1.9-.91-.25-.1-.43-.14-.62.14-.18.28-.71.91-.87 1.1-.16.18-.32.2-.6.07-.28-.14-1.18-.43-2.25-1.38-.83-.74-1.38-1.65-1.54-1.93-.16-.28-.02-.43.12-.57.12-.12.28-.32.42-.48.14-.16.18-.28.28-.46.1-.18.05-.34-.02-.48-.07-.14-.62-1.5-.85-2.06-.22-.53-.45-.46-.62-.46h-.53c-.18 0-.48.07-.73.34-.25.28-.96.94-.96 2.28 0 1.34.98 2.63 1.12 2.81.14.18 1.93 2.95 4.68 4.14 2.75 1.18 2.75.79 3.25.74.5-.05 1.65-.67 1.88-1.32.23-.65.23-1.21.16-1.32-.07-.11-.25-.18-.53-.32z"/>
              </svg>
            </a>

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
