export const metadata = {
  title: "Servicios | Óscar Martínez",
  description: "Servicios de modelado en Tekla, planos, producción y automatizaciones.",
};

export default function ServiciosPage() {
  return (
    <section className="py-24 bg-gray-100 dark:bg-[#111] px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-gray-100">
          Servicios
        </h1>

        <div className="grid md:grid-cols-2 gap-10">
          
          <div className="p-6 bg-white dark:bg-[#1a1a1a] rounded-xl shadow border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Modelado BIM en Tekla Structures
            </h2>
            <ul className="text-gray-700 dark:text-gray-300 space-y-2">
              <li>• Modelado de estructuras metálicas y de hormigón</li>
              <li>• Detallado constructivo</li>
              <li>• Colaboración con Trimble Connect y Tekla Model Sharing</li>
              <li>• Exportación planos y modelo a PDF, CAD e IFC</li>
            </ul>
          </div>

          <div className="p-6 bg-white dark:bg-[#1a1a1a] rounded-xl shadow border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Planos y documentación técnica
            </h2>
            <ul className="text-gray-700 dark:text-gray-300 space-y-2">
              <li>• Planos de fabricación</li>
              <li>• Planos de montaje</li>
              <li>• Listados y planillas de producción</li>
              <li>• Cuadros de materiales</li>
            </ul>
          </div>

          <div className="p-6 bg-white dark:bg-[#1a1a1a] rounded-xl shadow border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Automatizaciones y plugins para Tekla
            </h2>
            <ul className="text-gray-700 dark:text-gray-300 space-y-2">
              <li>• Desarrollo de plugins a medida</li>
              <li>• Automatización de tareas repetitivas</li>
              <li>• Generación automática de planos y listados</li>
              <li>• Herramientas internas para empresas prefabricadoras, ingenierías y constructoras</li>
            </ul>
          </div>

          <div className="p-6 bg-white dark:bg-[#1a1a1a] rounded-xl shadow border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Colaboración externa
            </h2>
            <ul className="text-gray-700 dark:text-gray-300 space-y-2">
              <li>• Refuerzo de equipos técnicos</li>
              <li>• Soporte en picos de trabajo</li>
              <li>• Trabajo por proyecto o por horas</li>
              <li>• Comunicación directa y flexible</li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}
