"use client";

import AboutSection from "../../components/AboutSection";
import TrustSection from "../../components/TrustSection";
import TestimonialsSection from "../../components/TestimonialsSection";
import RevealObserver from "../../components/RevealObserver";
import Link from "next/link";

const apps = [
  {
    title: "Modelado Tekla apoyado en automatización",
    description:
      "Trabajo de modelado profesional en Tekla Structures apoyado en automatizaciones para reducir tiempos, minimizar errores y mejorar la productividad real del proyecto.",
    video: "https://www.youtube.com/embed/gQp1t5xRz5Q",
  },
  {
    title: "Herramientas y aplicaciones para producción",
    description:
      "Herramientas desarrolladas para generar elementos estructurales de forma rápida y consistente, pensadas para flujos reales de oficina técnica y fábrica.",
    video: "https://www.youtube.com/embed/MBL7E9rF2HU",
  },
  {
    title: "Automatización aplicada a proyectos reales",
    description:
      "Plugins y aplicaciones creados a partir de necesidades reales en ingeniería, taller y obra, utilizados como apoyo al modelado profesional.",
    video: "https://www.youtube.com/embed/9HiQz_x9UCU",
  },
];

export default function HomePage() {
  return (
    <>
      <RevealObserver />

      {/* ----------------------------- */}
      {/* HERO / MENSAJE PRINCIPAL      */}
      {/* ----------------------------- */}
     <section className="
  w-full
  py-24 md:py-32
  text-center
  px-6 sm:px-10
  bg-[#f3f4f6] dark:bg-[#242424]
">
  <div className="max-w-4xl mx-auto">
    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-[#1f2937] dark:text-[#e6e6e6]">
      Modelado Tekla 
      <br />
      para prefabricado y<br />
       estructuras metálicas
    </h1>

    <p className="text-base sm:text-lg md:text-xl leading-relaxed mb-8 text-[#1f2937] dark:text-[#e6e6e6]">
      Ayudo a empresas de prefabricado de hormigón y estructuras metálicas
      a modelar estructuras listas para fabricar, reducir errores en taller
      y optimizar tiempos de producción.
      <br />
      <br />
      Más de 23 años de experiencia real en entorno industrial, combinando
      modelado avanzado en Tekla con automatización y herramientas propias
      desarrolladas para producción.
    </p>

    <Link
      href="/contacto"
      className="
        inline-block
        bg-blue-600 hover:bg-blue-700
        text-white
        px-6 py-3 md:px-7 md:py-4
        rounded-lg
        text-base md:text-lg
        font-semibold
        transition
      "
    >
      Hablemos de tu proyecto →
    </Link>
  </div>
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
          ¿Hablamos de tu proyecto?
        </h2>

        <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg">
          Si necesitas reforzar tu equipo técnico, optimizar tu flujo de trabajo
          en Tekla Structures o aplicar automatización real en tus proyectos,
          puedo ayudarte con soluciones prácticas y orientadas a producción.
        </p>

        <Link
          href="/contacto"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
        >
          Contactar →
        </Link>
      </section>
    </>
  );
}