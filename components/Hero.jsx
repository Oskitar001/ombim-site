export default function Hero() {
  return (
    <section
      role="banner"
      className="reveal bg-gradient-to-br from-gray-900 to-gray-700 text-white py-28 shadow-soft"
    >
      <div className="container mx-auto text-center">
        <h1 className="text-6xl font-extrabold tracking-tight mb-6">
          OMBIM
        </h1>

        <p className="text-xl opacity-90 max-w-2xl mx-auto leading-relaxed">
          Especialistas en <strong>Tekla Structures</strong>, automatizaciones BIM y desarrollo de
          <strong> software a medida</strong> para ingenierías y constructoras.
        </p>

        <div className="mt-10 flex gap-4 justify-center">
          <a
            href="#contacto"
            rel="prefetch"
            className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-lg shadow-soft transition-all active:scale-95"
          >
            Solicitar presupuesto
          </a>

          <a
            href="/proyectos"
            rel="prefetch"
            className="px-6 py-3 rounded-xl bg-white/20 hover:bg-white/30 text-white text-lg shadow-soft transition-all active:scale-95"
          >
            Ver proyectos
          </a>

          <a
            href="/sobre-nosotros"
            rel="prefetch"
            className="px-6 py-3 rounded-xl bg-white/20 hover:bg-white/30 text-white text-lg shadow-soft transition-all active:scale-95"
          >
            Sobre nosotros
          </a>
        </div>
      </div>
    </section>
  );
}
