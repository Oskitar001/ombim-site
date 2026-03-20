export default function Hero() {
  return (
    <section className="py-32 text-center max-w-4xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-bold mb-6">
        Especialista en Tekla Structures con más de 23 años de experiencia real
      </h1>

      <p className="text-[#1f2937] text-lg mb-8">
        Ayudo a ingenierías, constructoras y oficinas técnicas a modelar, documentar y optimizar sus proyectos mediante automatizaciones y plugins personalizados.
      </p>

      <p className="text-xl font-semibold mb-10">
        Experiencia real de obra + desarrollo avanzado para Tekla.
      </p>

      <div className="flex justify-center gap-4">
        <a
          href="#contacto"
          className="px-6 py-3 bg-blue-600 text-black rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Contactar
        </a>

        <a
          href="#servicios"
          className="px-6 py-3 border border-gray-400 rounded-lg font-semibold hover:bg-[#f3f4f6] transition"
        >
          Ver servicios
        </a>
      </div>
    </section>
  );
}
