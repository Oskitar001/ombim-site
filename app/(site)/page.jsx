"use client";

import AboutSection from "../../components/AboutSection";
import TrustSection from "../../components/TrustSection";
import TestimonialsSection from "../../components/TestimonialsSection";
import RevealObserver from "../../components/RevealObserver";

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
      "Combina aplicaciones con plugin y crea elementos estructurales en segundos. Configurable, preciso y diseñado para acelerar tus proyectos.",
    video: "https://www.youtube.com/embed/MBL7E9rF2HU",
  },
  {
    title: "Plugin Tekla Structures",
    description:
      "Mejora tu productividad con herramientas integradas directamente en Tekla. Flujo de trabajo más ágil y profesional.",
    video: "https://www.youtube.com/embed/9HiQz_x9UCU",
  },
];

export default function HomePage() {
  return (
    <>
      <RevealObserver />

      {/* CTA móvil */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 md:hidden z-50">
        <a
          href="/contacto"
          className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg text-base font-medium active:scale-95 transition-all"
        >
          Solicitar demo
        </a>
      </div>

      {/* Fondo global */}
      <div className="pb-20 min-h-screen bg-[#f3f4f6] dark:bg-[#242424]">

        {/* CONTENEDOR PRINCIPAL */}
        <div className="container mx-auto border-t border-gray-300 dark:border-gray-700">

          {/* HERO */}
          <section className="reveal text-center max-w-4xl mx-auto mt-20 mb-24 px-6">
            <div className="relative inline-block">
              <span className="absolute inset-0 bg-gradient-to-r from-blue-300/30 via-transparent to-blue-300/30 dark:from-blue-900/20 dark:to-blue-900/20 blur-xl rounded-full"></span>

              <h1 className="relative text-5xl md:text-6xl font-bold tracking-tight mb-6 text-[#1f2937] dark:text-[#e6e6e6]">
                Modelado 3D y Software para Tekla Structures
              </h1>
            </div>

            <div className="w-24 h-[3px] bg-blue-600 mx-auto rounded-full mb-10"></div>

            <p className="text-[#1f2937] dark:text-[#e6e6e6] text-xl md:text-2xl leading-relaxed mb-6">
              Más de <strong>20 años de experiencia</strong> en modelado 3D con Tekla Structures,
              aportando precisión, detalle y eficiencia en estructuras metálicas y de hormigón.
            </p>

            <p className="text-[#1f2937] dark:text-[#e6e6e6] text-lg md:text-xl leading-relaxed mb-10">
              Más de <strong>100 proyectos reales</strong> optimizados con <strong>software propio</strong>:
              plugins, automatizaciones y herramientas internas que aceleran tu flujo BIM y reducen errores.
            </p>

            <a
              href="/contacto"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-medium transition-all duration-300 hover:bg-blue-700 hover:shadow-xl hover:-translate-y-1 active:scale-95"
            >
              Solicitar demo personalizada <span className="text-2xl">→</span>
            </a>
          </section>

          {/* CARDS */}
          <div className="grid md:grid-cols-3 gap-10 px-6">
            {apps.map((app, index) => (
              <div
                key={index}
                className="reveal bg-[#ffffff] dark:bg-[#1a1a1a] rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-500 hover:-translate-y-2 border border-gray-200 dark:border-gray-700"
              >
                <div className="rounded-xl overflow-hidden mb-4">
                  <iframe
                    className="w-full aspect-video"
                    src={`${app.video}?rel=0&modestbranding=1&controls=1&autoplay=0&mute=0`}
                    title={app.title}
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  ></iframe>
                </div>

                <h3 className="text-xl font-semibold mb-2 text-[#1f2937] dark:text-[#e6e6e6]">
                  {app.title}
                </h3>

                <p className="text-[#1f2937] dark:text-[#e6e6e6] mb-4">
                  {app.description}
                </p>

                <a
                  href="/contacto"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 active:scale-95 transition-all"
                >
                  Solicitar demo ahora
                  <span className="text-base">→</span>
                </a>

                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Respuesta en menos de 24h
                </p>
              </div>
            ))}
          </div>

          {/* ABOUT + TRUST + TESTIMONIALS */}
          <div className="mt-32">
            <AboutSection />
            <TrustSection />
            <TestimonialsSection />
          </div>

          {/* CTA FINAL */}
          <div className="reveal text-center mt-32 px-6">
            <h2 className="text-3xl font-bold mb-4 text-[#1f2937] dark:text-[#e6e6e6]">
              ¿Quieres ver cómo funciona en tu proyecto?
            </h2>

            <p className="text-[#1f2937] dark:text-[#e6e6e6] mb-6">
              Te preparamos una demo personalizada sin compromiso.
            </p>

            <a
              href="/contacto"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl text-lg font-medium transition-all duration-300 hover:bg-blue-700 hover:shadow-lg active:scale-95"
            >
              Solicitar demo personalizada <span className="text-xl">→</span>
            </a>
          </div>

        </div>
      </div>
    </>
  );
}