export default function Hero() {
  return (
    <section
      role="banner"
      className="reveal bg-gradient-to-br from-gray-900 to-gray-700 text-white py-16 md:py-20 shadow-soft"
    >
      <div className="container mx-auto text-center px-6">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
          OMBIM
        </h1>

        <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto leading-relaxed">
          Modelado BIM con <strong>Tekla Structures</strong> y desarrollo de APIs y automatizaciones
          para optimizar tus proyectos.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#contacto"
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-lg shadow-soft transition-all active:scale-95"
          >
            Solicitar presupuesto
          </a>

          <a
            href="/proyectos"
            className="px-6 py-3 rounded-xl bg-white/20 hover:bg-white/30 text-white text-lg shadow-soft transition-all active:scale-95"
          >
            Ver proyectos
          </a>
        </div>
      </div>
    </section>
  );
}
