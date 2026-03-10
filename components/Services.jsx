export default function Services() {
  return (
    <section id="servicios" className="py-20">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">Servicios</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-6 rounded-2xl border bg-white shadow-sm">
            <h3 className="text-2xl font-semibold mb-2">Modelado Tekla Structures</h3>
            <p className="text-gray-700">Modelos BIM detallados y precisos, cumpliendo estándares técnicos y constructivos.</p>
          </div>
          <div className="p-6 rounded-2xl border bg-white shadow-sm">
            <h3 className="text-2xl font-semibold mb-2">APIs y Automatizaciones</h3>
            <p className="text-gray-700">Plugins, scripts y herramientas personalizadas para optimizar el flujo de trabajo en Tekla.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
