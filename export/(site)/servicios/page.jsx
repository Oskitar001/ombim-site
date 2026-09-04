export const metadata = {
  title: "Servicios | Óscar Martínez",
  description:
    "Servicios profesionales de modelado en Tekla Structures, documentación técnica y automatización de procesos.",
};

export default function ServiciosPage() {
  return (
    <section className="py-24 bg-[#f3f4f6] dark:bg-[#242424] px-6">
      <div className="max-w-5xl mx-auto">
        
        <h1 className="text-4xl font-bold text-center mb-12 text-[#1f2937] dark:text-[#e6e6e6]">
          Servicios
        </h1>

        <div className="grid md:grid-cols-2 gap-10">

          {/* BLOQUE 1 */}
          <div className="p-6 bg-[#f3f4f6] dark:bg-[#1a1a1a] rounded-xl shadow border border-[#d1d5db] dark:border-[#3a3a3a]">
            <h2 className="text-2xl font-semibold mb-4 text-[#1f2937] dark:text-[#e6e6e6]">
              Modelado BIM en Tekla Structures
            </h2>

            <ul className="text-[#1f2937] dark:text-[#e6e6e6] space-y-2">
              <li>• Modelado avanzado de estructuras metálicas y prefabricadas de hormigón</li>
              <li>• Modelado orientado a fabricación y montaje</li>
              <li>• Gestión de revisiones y cambios de proyecto</li>
              <li>• Coordinación directa con ingeniería, taller y obra</li>
            </ul>
          </div>

          {/* BLOQUE 2 */}
          <div className="p-6 bg-[#f3f4f6] dark:bg-[#1a1a1a] rounded-xl shadow border border-[#d1d5db] dark:border-[#3a3a3a]">
            <h2 className="text-2xl font-semibold mb-4 text-[#1f2937] dark:text-[#e6e6e6]">
              Planos y documentación técnica
            </h2>

            <ul className="text-[#1f2937] dark:text-[#e6e6e6] space-y-2">
              <li>• Planos de fabricación</li>
              <li>• Planos de montaje</li>
              <li>• Listados y planillas de producción</li>
              <li>• Extracción de datos fiables para producción y obra</li>
            </ul>
          </div>

          {/* BLOQUE 3 */}
          <div className="p-6 bg-[#f3f4f6] dark:bg-[#1a1a1a] rounded-xl shadow border border-[#d1d5db] dark:border-[#3a3a3a]">
            <h2 className="text-2xl font-semibold mb-4 text-[#1f2937] dark:text-[#e6e6e6]">
              Automatización y optimización de flujos Tekla
            </h2>

            <ul className="text-[#1f2937] dark:text-[#e6e6e6] space-y-2">
              <li>• Uso y desarrollo de plugins y herramientas propias</li>
              <li>• Automatización de tareas repetitivas</li>
              <li>• Generación automática de planos y documentación</li>
              <li>• Adaptación de Tekla a los procesos reales de cada empresa</li>
            </ul>
          </div>

          {/* BLOQUE 4 */}
          <div className="p-6 bg-[#f3f4f6] dark:bg-[#1a1a1a] rounded-xl shadow border border-[#d1d5db] dark:border-[#3a3a3a]">
            <h2 className="text-2xl font-semibold mb-4 text-[#1f2937] dark:text-[#e6e6e6]">
              Colaboración externa flexible
            </h2>

            <ul className="text-[#1f2937] dark:text-[#e6e6e6] space-y-2">
              <li>• Refuerzo de equipos técnicos</li>
              <li>• Soporte en picos de trabajo</li>
              <li>• Colaboración por proyecto, por horas o continuada</li>
              <li>• Trabajo remoto con comunicación directa y fluida</li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}