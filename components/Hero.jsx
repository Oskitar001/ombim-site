{/* HERO VISUAL CORRECTO */}
<section
  className="relative h-[70vh] w-full flex items-center justify-center text-center px-6"
  style={{
    backgroundImage: "url('/images/hero-tekla.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>
  {/* Overlay adaptado a tema */}
  <div className="absolute inset-0 bg-black/50 dark:bg-black/60 backdrop-blur-sm"></div>

  {/* Contenido */}
  <div className="relative max-w-4xl mx-auto text-white">
    <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 drop-shadow-xl">
      Plugins, automatizaciones y modelado 3D <br />
      para Tekla Structures
    </h1>

    <p className="text-lg md:text-2xl opacity-90 leading-relaxed mb-10 drop-shadow-lg">
      Acelera tu flujo BIM con herramientas profesionales creadas desde la experiencia real
      en obra, fabricación y modelado avanzado.
    </p>

    <Link
      href="/contacto"
      className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-lg transition"
    >
      Solicitar demo personalizada →
    </Link>
  </div>
</section>
``