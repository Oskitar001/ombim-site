export default function TestimonialsSection() {
  return (
    <section className="reveal max-w-3xl mx-auto text-center mb-24 px-6">

      <h2 className="text-3xl font-bold mb-6 text-[#1f2937] dark:text-[#e6e6e6]">
        Lo que dicen nuestros clientes
      </h2>

      <blockquote className="bg-[#f3f4f6]Soft dark:bg-[#1a1a1a] p-6 rounded-xl shadow-soft border border-[#d1d5db] dark:border-[#3a3a3a]">
        <p className="text-[#1f2937] dark:text-[#e6e6e6] italic">
          “Las automatizaciones de OMBIM nos han ahorrado decenas de horas por proyecto.
          El flujo de trabajo en Tekla es ahora mucho más rápido y fiable.”
        </p>

        <footer className="mt-4 text-[#1f2937] dark:text-gray-400 font-medium">
          — Responsable BIM, Ingeniería Estructural
        </footer>
      </blockquote>

    </section>
  );
}
