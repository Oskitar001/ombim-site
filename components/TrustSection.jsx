// components/TrustSection.jsx
export default function TrustSection() {
  return (
    <section className="reveal max-w-4xl mx-auto grid md:grid-cols-3 gap-10 text-center mb-24">
      <div>
        <h3 className="text-xl font-semibold mb-2">+10 años de experiencia</h3>
        <p className="text-gray-600">
          Desarrollando soluciones BIM y automatizaciones para Tekla Structures.
        </p>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Software usado por empresas reales</h3>
        <p className="text-gray-600">
          Más de 40 empresas utilizan nuestras herramientas en proyectos de ingeniería y construcción.
        </p>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Soluciones a medida</h3>
        <p className="text-gray-600">
          Creamos automatizaciones adaptadas a tus procesos y necesidades específicas.
        </p>
      </div>
    </section>
  );
}
