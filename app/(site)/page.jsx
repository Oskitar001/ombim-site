"use client";

import AboutSection from "../../components/AboutSection";
import TrustSection from "../../components/TrustSection";
import TestimonialsSection from "../../components/TestimonialsSection";
import RevealObserver from "../../components/RevealObserver";
import Link from "next/link";

const apps = [
  {
    title: "Modelado 3D con automatización",
    description:
      "Reduce horas de trabajo automatizando tareas repetitivas en Tekla. Más precisión, menos errores y un flujo BIM más rápido.",
    video: "https://www.youtube.com/embed/gQp1t5xRz5Q",
  },
  {
    title: "Aplicaciones Tekla Structures",
    description:
      "Combina aplicaciones con plugins para crear elementos estructurales en segundos. Configurable, preciso y pensado para acelerar tus proyectos.",
    video: "https://www.youtube.com/embed/MBL7E9rF2HU",
  },
  {
    title: "Plugins profesionales para Tekla",
    description:
      "Mejora tu productividad con herramientas creadas para resolver problemas reales del día a día en ingeniería, taller y obra.",
    video: "https://www.youtube.com/embed/9HiQz_x9UCU",
  },
];

export default function HomePage() {
  return (
    <>
      <RevealObserver />

      {/* ----------------------------- */}
      {/* TÍTULO SIMPLE                 */}
      {/* ----------------------------- */}
      <section className="pt-24 pb-10 text-center max-w-4xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-6">
          Modelado 3D, automatizaciones y plugins
          <br />
          para Tekla Structures
        </h1>

        <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-8">
          Aumento la productividad de ingenierías, constructoras y oficinas técnicas
          mediante herramientas personalizadas, flujos BIM optimizados y 23 años de
          experiencia real en obra, fabricación y modelado avanzado.
        </p>

        <Link
          href="/contacto"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
        >
          Solicitar demo personalizada →
        </Link>
      </section>

      {/* ----------------------------- */}
      {/* CARDS CON VÍDEO              */}
      {/* ----------------------------- */}
      <section className="py-10 max-w-6xl mx-auto grid md:grid-cols-3 gap-10 px-6">
        {apps.map((app, index) => (
          <div
            key={index}
            className="bg-gray-200 dark:bg-gray-800 p-5 rounded-lg shadow reveal flex flex-col gap-4"
          >
            <h3 className="text-xl font-bold">{app.title}</h3>
            <p className="opacity-80">{app.description}</p>

            <div className="rounded overflow-hidden">
              <iframe
                width="100%"
                height="200"
                src={app.video}
                title={app.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded"
              ></iframe>
            </div>

            <Link
              href="/contacto"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-center w-full"
            >
              Solicitar demo →
            </Link>

            <span className="text-sm opacity-70">Respuesta en menos de 24h</span>
          </div>
        ))}
      </section>

      {/* SOBRE MÍ */}
      <AboutSection />

      {/* CONFIANZA */}
      <TrustSection />

      {/* TESTIMONIOS */}
      <TestimonialsSection />

      {/* ----------------------------- */}
      {/* CTA FINAL                     */}
      {/* ----------------------------- */}
      <section className="py-20 text-center max-w-3xl mx-auto px-6 reveal">
        <h2 className="text-3xl font-bold mb-4">
          ¿Quieres mejorar tu productividad en Tekla?
        </h2>

        <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg">
          Preparo una demo personalizada adaptada a tu empresa: automatizaciones, plugins,
          modelado 3D o flujos BIM. Soluciones reales y prácticas.
        </p>

        <Link
          href="/contacto"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
        >
          Solicitar demo →
        </Link>
      </section>
    </>
  );
}