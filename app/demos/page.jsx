export const metadata = {
  title: "Demos | Óscar Martínez",
  description: "Ejemplos de automatizaciones, plugins y trabajos realizados en Tekla Structures.",
};

export default function DemosPage() {
  return (
    <section className="max-w-5xl mx-auto px-6 mt-40 mb-32">

      {/* TÍTULO PREMIUM */}
      <div className="text-center mb-16">
        <div className="relative inline-block">
          <span className="absolute inset-0 bg-gradient-to-r from-blue-200/40 via-transparent to-blue-200/40 blur-xl rounded-full"></span>

          <h1 className="relative text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Demos y Automatizaciones
          </h1>
        </div>

        {/* LÍNEA TÉCNICA */}
        <div className="w-24 h-[3px] bg-blue-600 mx-auto rounded-full mb-10"></div>

        {/* TEXTO ORIGINAL */}
        <p className="text-gray-700 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
          Aquí puedes ver algunos ejemplos de las automatizaciones, plugins y herramientas que he desarrollado para Tekla Structures. 
          Cada una de ellas está pensada para reducir tiempos, evitar errores y mejorar el flujo de trabajo en proyectos reales.
        </p>
      </div>

      {/* GRID DE DEMOS */}
      <div className="grid md:grid-cols-2 gap-12">

        {/* EJEMPLO 1 */}
        <div className="bg-white shadow-soft hover:shadow-xl transition-all duration-300 rounded-2xl p-8 border border-gray-200">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            Plugin: Generación automática de planos
          </h2>

          <p className="text-gray-600 mb-4 text-lg">
            Herramienta que genera planos de fabricación de forma automática según criterios definidos por el cliente.
          </p>

          <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-inner">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/VIDEO_ID"
              title="Demo plugin Tekla"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        {/* EJEMPLO 2 */}
        <div className="bg-white shadow-soft hover:shadow-xl transition-all duration-300 rounded-2xl p-8 border border-gray-200">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            Automatización: Listados de producción
          </h2>

          <p className="text-gray-600 mb-4 text-lg">
            Script que genera planillas de producción en segundos, evitando errores manuales.
          </p>

          <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-inner">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/VIDEO_ID"
              title="Demo automatización Tekla"
              allowFullScreen
            ></iframe>
          </div>
        </div>

      </div>

      {/* CTA FINAL */}
      <p className="text-center text-gray-700 mt-20 text-lg">
        ¿Quieres ver una demo personalizada o necesitas una herramienta a medida?  
        <a href="/contacto" className="text-blue-600 font-semibold hover:underline ml-1">
          Contáctame aquí
        </a>.
      </p>

      {/* SEPARADOR PREMIUM */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent mt-20"></div>

    </section>
  );
}
