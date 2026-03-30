<section
  className="
    relative w-full 
    h-[60vh] md:h-[75vh] 
    flex items-center justify-center 
    text-center px-6 sm:px-10
    overflow-hidden
  "
  style={{
    backgroundImage: "url('/images/hero-tekla.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>
  {/* Overlay premium */}
  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/40 to-black/60 dark:from-black/50 dark:via-black/60 dark:to-black/70 backdrop-blur-[2px]" />

  {/* Contenido */}
  <div className="relative max-w-3xl mx-auto text-white">
    <h1 className="
      text-3xl sm:text-4xl md:text-5xl font-bold 
      leading-tight md:leading-tight 
      mb-5 drop-shadow-xl
    ">
      Plugins, automatizaciones y modelado 3D <br />
      para Tekla Structures
    </h1>

    <p className="
      text-base sm:text-lg md:text-xl 
      opacity-95 leading-relaxed 
      mb-8 drop-shadow-lg
    ">
      Acelera tu flujo BIM con herramientas profesionales creadas desde la experiencia real
      en obra, fabricación y modelado avanzado.
    </p>

    <Link
      href="/contacto"
      className="
        inline-block 
        bg-blue-600 hover:bg-blue-700 
        text-white 
        px-5 py-3 md:px-7 md:py-4 
        rounded-lg 
        text-base md:text-lg 
        font-semibold 
        shadow-xl 
        transition
      "
    >
      Solicitar demo personalizada →
    </Link>
  </div>

  {/* Fade inferior premium */}
  <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black/40 dark:from-black/50 to-transparent"></div>
</section>
``