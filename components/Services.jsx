export default function Services() {
  return (
    <section id="servicios" className="py-24 bg-[#f3f4f6]">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">Servicios</h2>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="p-6 bg-[#f3f4f6]Soft rounded-xl shadow">
            <h3 className="text-2xl font-semibold mb-4">Modelado BIM en Tekla Structures</h3>
            <ul className="text-[#1f2937] space-y-2">
              <li>• Modelado de estructuras metálicas y de hormigón</li>
              <li>• Detallado constructivo</li>
              <li>• Gestión de revisiones</li>
              <li>• Coordinación con ingeniería y obra</li>
            </ul>
          </div>

          <div className="p-6 bg-[#f3f4f6]Soft rounded-xl shadow">
            <h3 className="text-2xl font-semibold mb-4">Planos y documentación técnica</h3>
            <ul className="text-[#1f2937] space-y-2">
              <li>• Planos de fabricación</li>
              <li>• Planos de montaje</li>
              <li>• Listados y planillas de producción</li>
              <li>• Cuadros de materiales</li>
            </ul>
          </div>

          <div className="p-6 bg-[#f3f4f6]Soft rounded-xl shadow">
            <h3 className="text-2xl font-semibold mb-4">Automatizaciones y plugins para Tekla</h3>
            <ul className="text-[#1f2937] space-y-2">
              <li>• Desarrollo de plugins a medida</li>
              <li>• Automatización de tareas repetitivas</li>
              <li>• Generación automática de planos y listados</li>
              <li>• Herramientas internas para ingenierías y constructoras</li>
            </ul>
          </div>

          <div className="p-6 bg-[#f3f4f6]Soft rounded-xl shadow">
            <h3 className="text-2xl font-semibold mb-4">Colaboración externa</h3>
            <ul className="text-[#1f2937] space-y-2">
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
