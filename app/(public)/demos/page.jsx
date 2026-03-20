export const metadata = {
  title: "Demos | Óscar Martínez",
  description: "Ejemplos de automatizaciones, plugins y trabajos realizados en Tekla Structures.",
};

export default function DemosPage() {
  return (
    <section className="py-24 max-w-5xl mx-auto px-6 bg-[#f3f4f6]Soft dark:bg-[#242424]">
      <h1 className="text-4xl font-bold text-center mb-12 text-[#1f2937] dark:text-[#e6e6e6]">
        Demos y Automatizaciones
      </h1>

      <p className="text-[#1f2937] dark:text-[#e6e6e6] text-center mb-16 max-w-3xl mx-auto">
        Aquí puedes ver algunos ejemplos de las automatizaciones, plugins y herramientas que he desarrollado para Tekla Structures. 
        Cada una de ellas está pensada para reducir tiempos, evitar errores y mejorar el flujo de trabajo en proyectos reales.
      </p>

      <div className="grid md:grid-cols-2 gap-12">

        {/* EJEMPLO 1 */}
        <div className="bg-[#f3f4f6]Soft dark:bg-[#1a1a1a] shadow rounded-xl p-6 border border-[#d1d5db] dark:border-[#3a3a3a]">
          <h2 className="text-2xl font-semibold mb-4 text-[#1f2937] dark:text-[#e6e6e6]">
            Plugin: Uniones automáticas de elementos
          </h2>

          <p className="text-[#1f2937] dark:text-[#e6e6e6] mb-4">
            Herramientas que generan uniones de forma automática según criterios definidos por el cliente.
          </p>

          <div className="aspect-video bg-black dark:bg-[#000] rounded-lg overflow-hidden">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/VIDEO_ID"
              title="Demo plugin Tekla"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        {/* EJEMPLO 2 */}
        <div className="bg-[#f3f4f6]Soft dark:bg-[#1a1a1a] shadow rounded-xl p-6 border border-[#d1d5db] dark:border-[#3a3a3a]">
          <h2 className="text-2xl font-semibold mb-4 text-[#1f2937] dark:text-[#e6e6e6]">
            Automatización: Listados de producción
          </h2>

          <p className="text-[#1f2937] dark:text-[#e6e6e6] mb-4">
            Script que genera planillas de producción en segundos, evitando errores manuales.
          </p>

          <div className="aspect-video bg-black dark:bg-[#000] rounded-lg overflow-hidden">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/VIDEO_ID"
              title="Demo automatización Tekla"
              allowFullScreen
            ></iframe>
          </div>
        </div>

      </div>

      <p className="text-center text-[#1f2937] dark:text-[#e6e6e6] mt-16">
        ¿Quieres ver una demo personalizada o necesitas una herramienta a medida?  
        <a href="/contacto" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
          Contáctame aquí
        </a>.
      </p>
    </section>
  );
}
