"use client";

export default function AboutSection() {
  return (
    <section className="py-20 max-w-5xl mx-auto px-6 reveal">
      <h2 className="text-3xl font-bold mb-8 text-center">Sobre mí</h2>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
        Soy Óscar Martínez, especialista en Tekla Structures con más de 23 años de experiencia
        en modelado avanzado, fabricación, prefabricado y montaje. Durante más de dos décadas
        trabajé en proyectos reales que me permitieron conocer cada fase del proceso constructivo:
        desde la ingeniería, al taller y la obra.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Actualmente ayudo a empresas a mejorar su productividad mediante automatizaciones,
        plugins personalizados y flujos BIM optimizados. Mi objetivo es claro: que tus modelos
        sean más rápidos de producir, más precisos y totalmente adaptados a tus necesidades reales.
      </p>
    </section>
  );
}