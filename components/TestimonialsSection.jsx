// components/TestimonialsSection.jsx
export default function TestimonialsSection() {
  return (
    <section className="reveal max-w-3xl mx-auto text-center mb-24">
      <h2 className="text-3xl font-bold mb-6">Lo que dicen nuestros clientes</h2>

      <blockquote className="bg-white p-6 rounded-xl shadow-soft">
        <p className="text-gray-700 italic">
          “Las automatizaciones de OMBIM nos han ahorrado decenas de horas por proyecto.
          El flujo de trabajo en Tekla es ahora mucho más rápido y fiable.”
        </p>

        <footer className="mt-4 text-gray-600 font-medium">
          — Responsable BIM, Ingeniería Estructural
        </footer>
      </blockquote>
    </section>
  );
}
