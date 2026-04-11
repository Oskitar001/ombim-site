<section
  className="
    relative w-full 
    h-[60vh] md:h-[75vh] 
    flex items-center justify-center 
    text-center px-6 sm:px-10
    overflow-hidden
  "
  
>
  {/* Overlay premium */}
  <div className="absolute inset-0 bg-gradient-to-b
  from-black/70 via-black/70 to-black/80 dark:from-black/50 dark:via-black/60 dark:to-black/70 backdrop-blur-[2px]" />

  {/* Contenido */}
  <div className="relative max-w-3xl mx-auto text-white">
    <h1
      className="
        text-3xl sm:text-4xl md:text-5xl font-bold 
        leading-tight md:leading-tight 
        mb-5 drop-shadow-xl
      "
    >
      Modelado Tekla orientado a producción
      <br />
      para prefabricado y estructuras metálicas
    </h1>

    <p
      className="
        text-base sm:text-lg md:text-xl 
        opacity-95 leading-relaxed 
        mb-8 drop-shadow-lg
      "
    >
      Ayudo a empresas de prefabricado de hormigón y estructuras metálicas
      a modelar estructuras listas para fabricar, reducir errores en taller
      y optimizar tiempos de producción.
      <br />
      <br />
      Más de 23 años de experiencia real en entorno industrial, combinando
      modelado avanzado en Tekla con automatización y herramientas propias
      desarrolladas para producción.
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
      Hablemos de tu proyecto →
    </Link>
  </div>

  {/* Fade inferior premium */}
  <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black/40 dark:from-black/50 to-transparent"></div>
</section>