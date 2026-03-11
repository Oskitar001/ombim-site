export const metadata = {
  title: "Servicios | Óscar Martínez",
  description: "Servicios de modelado en Tekla, planos, producción y automatizaciones.",
};

export default function ServiciosPage() {
  return (
    <section className="py-24 bg-gray-100 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12">Servicios</h1>

        <div className="grid md:grid-cols-2 gap-10">
          
          <div className="p-6 bg-white rounded-xl shadow">
            <h2 className="text-2xl font-semibold mb-4">Modelado BIM en Tekla Structures</h2>
            <ul className="text-gray-700 space-y-2">
              <li>• Modelado de estructuras metálicas y de hormigón</li>
              <li>• Detallado constructivo</li>
              <li>• Gestión de revisiones</li>
              <li>• Coordinación con ingeniería y obra</li>
            </ul>
          </div>

          <div className="p-6 bg-white rounded-xl shadow">
            <h2 className="text-2xl font-semibold mb-4">Planos y documentación técnica</h2>
            <ul className="text-gray-700 space-y-2">
              <li>• Planos de fabricación</li>
              <li>• Planos de montaje</li>
              <li>• Listados y planillas de producción</li>
              <li>• Cuadros de materiales</li>
            </ul>
          </div>

          <div className="p-6 bg-white rounded-xl shadow">
            <h2 className="text-2xl font-semibold mb-4">Automatizaciones y plugins para Tekla</h2>
            <ul className="text-gray-700 space-y-2">
              <li>• Desarrollo de plugins a medida</li>
              <li>• Automatización de tareas repetitivas</li>
              <li>• Generación automática de planos y listados</li>
              <li>• Herramientas internas para ingenierías y constructoras</li>
            </ul>
          </div>

          <div className="p-6 bg-white rounded-xl shadow">
            <h2 className="text-2xl font-semibold mb-4">Colaboración externa</h2>
            <ul className="text-gray-700 space-y-2">
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
