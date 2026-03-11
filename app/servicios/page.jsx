export const metadata = {
  title: "Servicios | Óscar Martínez",
  description: "Servicios de modelado en Tekla, planos, producción y automatizaciones.",
};

export default function ServiciosPage() {
  return (
    <section className="bg-gray-100 px-6 mt-40 mb-32">

      <div className="max-w-5xl mx-auto text-center">

        {/* TÍTULO PREMIUM */}
        <div className="relative inline-block">
          <span className="absolute inset-0 bg-gradient-to-r from-blue-200/40 via-transparent to-blue-200/40 blur-xl rounded-full"></span>

          <h1 className="relative text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Servicios
          </h1>
        </div>

        {/* LÍNEA TÉCNICA */}
        <div className="w-24 h-[3px] bg-blue-600 mx-auto rounded-full mb-16"></div>

      </div>

      {/* GRID DE SERVICIOS */}
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">

        <div className="p-8 bg-white rounded-2xl shadow-soft hover:shadow-xl transition-all duration-300 border border-gray-200">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            Modelado BIM en Tekla Structures
          </h2>
          <ul className="text-gray-700 space-y-2 text-lg">
            <li>• Modelado de estructuras metálicas y de hormigón</li>
            <li>• Detallado constructivo</li>
            <li>• Gestión de revisiones</li>
            <li>• Coordinación con ingeniería y obra</li>
          </ul>
        </div>

        <div className="p-8 bg-white rounded-2xl shadow-soft hover:shadow-xl transition-all duration-300 border border-gray-200">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            Planos y documentación técnica
          </h2>
          <ul className="text-gray-700 space-y-2 text-lg">
            <li>• Planos de fabricación</li>
            <li>• Planos de montaje</li>
            <li>• Listados y planillas de producción</li>
            <li>• Cuadros de materiales</li>
          </ul>
        </div>

        <div className="p-8 bg-white rounded-2xl shadow-soft hover:shadow-xl transition-all duration-300 border border-gray-200">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            Automatizaciones y plugins para Tekla
          </h2>
          <ul className="text-gray-700 space-y-2 text-lg">
            <li>• Desarrollo de plugins a medida</li>
            <li>• Automatización de tareas repetitivas</li>
            <li>• Generación automática de planos y listados</li>
            <li>• Herramientas internas para ingenierías y constructoras</li>
          </ul>
        </div>

        <div className="p-8 bg-white rounded-2xl shadow-soft hover:shadow-xl transition-all duration-300 border border-gray-200">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            Colaboración externa
          </h2>
          <ul className="text-gray-700 space-y-2 text-lg">
            <li>• Refuerzo de equipos técnicos</li>
            <li>• Soporte en picos de trabajo</li>
            <li>• Trabajo por proyecto o por horas</li>
            <li>• Comunicación directa y flexible</li>
          </ul>
        </div>

      </div>

      {/* SEPARADOR PREMIUM */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent mt-24"></div>

    </section>
  );
}
