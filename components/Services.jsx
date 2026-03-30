export default function Services() {
  return (
    <section id="servicios" className="py-20 bg-[#f8f9fb] dark:bg-[#1f1f1f]">
      <div className="max-w-6xl mx-auto px-6">

        {/* TÍTULO */}
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          Servicios
        </h2>

        <p className="text-center text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-14 leading-relaxed">
          Soluciones especializadas en Tekla Structures para acelerar tu flujo BIM,
          mejorar la precisión y optimizar procesos internos de tu empresa.
        </p>

        {/* GRID PREMIUM */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* CARD */}
          <div className="p-7 rounded-2xl bg-white dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition">
            <h3 className="text-xl md:text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              Modelado BIM en Tekla Structures
            </h3>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300 leading-relaxed">
              <li>— Modelado de estructuras metálicas y de hormigón</li>
              <li>— Detallado constructivo</li>
              <li>— Gestión de revisiones</li>
              <li>— Coordinación con ingeniería y obra</li>
            </ul>
          </div>

          <div className="p-7 rounded-2xl bg-white dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition">
            <h3 className="text-xl md:text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              Planos y documentación técnica
            </h3>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300 leading-relaxed">
              <li>— Planos de fabricación</li>
              <li>— Planos de montaje</li>
              <li>— Listados y planillas de producción</li>
              <li>— Cuadros de materiales</li>
            </ul>
          </div>

          <div className="p-7 rounded-2xl bg-white dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition">
            <h3 className="text-xl md:text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              Automatizaciones y plugins para Tekla
            </h3>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300 leading-relaxed">
              <li>— Desarrollo de plugins a medida</li>
              <li>— Automatización de tareas repetitivas</li>
              <li>— Generación automática de planos y listados</li>
              <li>— Herramientas internas para ingenierías y constructoras</li>
            </ul>
          </div>

          <div className="p-7 rounded-2xl bg-white dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition">
            <h3 className="text-xl md:text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              Colaboración externa
            </h3>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300 leading-relaxed">
              <li>— Refuerzo de equipos técnicos</li>
              <li>— Soporte en picos de trabajo</li>
              <li>— Trabajo por proyecto o por horas</li>
              <li>— Comunicación directa y flexible</li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}