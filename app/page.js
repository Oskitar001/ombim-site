// app/page.js
import Script from "next/script";

// Secciones externas
import AboutSection from "../components/AboutSection";
import TrustSection from "../components/TrustSection";
import TestimonialsSection from "../components/TestimonialsSection";

const apps = [
  {
    title: "Automatización",
    description:
      "Reduce horas de trabajo automatizando tareas repetitivas en Tekla. Más precisión, menos errores y un flujo BIM más rápido.",
    video: "/videos/demo1.mp4"
  },
  {
    title: "Aplicaciones Tekla Structures",
    description:
      "Combina aplicaciones con plugin y crea elementos estructurales en segundos. Configurable, preciso y diseñado para acelerar tus proyectos.",
    video: "/videos/demo2.mp4"
  },
  {
    title: "Plugin Tekla Structures",
    description:
      "Mejora tu productividad con herramientas integradas directamente en Tekla. Flujo de trabajo más ágil y profesional.",
    video: "/videos/demo3.mp4"
  }
];

export default function HomePage() {
  return (
    <>
      {/* Scroll Depth Tracking */}
      <Script id="scroll-depth" strategy="afterInteractive">
        {`
          let maxScroll = 0;
          window.addEventListener('scroll', () => {
            const scrolled = window.scrollY + window.innerHeight;
            const total = document.body.scrollHeight;
            const percent = Math.round((scrolled / total) * 100);

            if (percent > maxScroll) {
              maxScroll = percent;
              console.log("Scroll depth:", percent + "%");
            }
          });
        `}
      </Script>

      {/* Exit Intent Detection */}
      <Script id="exit-intent" strategy="afterInteractive">
        {`
          document.addEventListener("mouseout", function(e) {
            if (e.clientY < 0) {
              console.log("Exit intent detected");
            }
          });
        `}
      </Script>

      {/* Scroll Reveal */}
      <Script id="scroll-reveal" strategy="afterInteractive">
        {`
          const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                observer.unobserve(entry.target);
              }
            });
          }, { threshold: 0.15 });

          document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
        `}
      </Script>

      {/* Sticky CTA (mobile only) */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 md:hidden z-50">
        <a
          href="/contacto"
          className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg text-base font-medium active:scale-95 transition-all"
        >
          Solicitar demo
        </a>
      </div>

      <main
        className="pt-12 pb-20 min-h-screen border-t border-gray-200 bg-gradient-to-b from-gray-50 to-gray-100"
        role="main"
      >
        <div className="container mx-auto">

          {/* HERO PREMIUM */}
          <section className="reveal text-center max-w-4xl mx-auto mt-32 mb-24 px-6">

            {/* Degradado suave detrás del título */}
            <div className="relative inline-block">
              <span className="absolute inset-0 bg-gradient-to-r from-blue-200/40 via-transparent to-blue-200/40 blur-xl rounded-full"></span>

              <h1 className="relative text-5xl md:text-6xl font-bold tracking-tight mb-6">
                Modelado 3D & Software para Tekla Structures
              </h1>
            </div>

            {/* Línea técnica premium */}
            <div className="w-24 h-[3px] bg-blue-600 mx-auto rounded-full mb-10"></div>

            {/* Subtítulo mejorado */}
            <p className="text-gray-700 text-xl md:text-2xl leading-relaxed mb-6">
              Más de <strong>20 años de experiencia</strong> en modelado 3D con Tekla Structures,
              aportando precisión, detalle y eficiencia en estructuras metálicas y de hormigón.
            </p>

            <p className="text-gray-700 text-lg md:text-xl leading-relaxed mb-10">
              Además, más de <strong>100 proyectos</strong> han sido optimizados con
              <strong> software propio</strong>: plugins, automatizaciones, macros y herramientas avanzadas
              que aceleran el flujo BIM y reducen errores.
            </p>

            {/* CTA elegante */}
            <a
              href="/contacto"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-medium transition-all duration-300 hover:bg-blue-700 hover:shadow-xl hover:-translate-y-1 active:scale-95"
            >
              Solicitar demo personalizada
              <span className="text-2xl">→</span>
            </a>

          </section>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent my-20"></div>

          {/* CARDS */}
          <div className="grid md:grid-cols-3 gap-10">
            {apps.map((app, index) => (
              <div
                key={index}
                role="article"
                className="reveal bg-white rounded-2xl p-6 shadow-soft shadow-soft-hover transition-all duration-500 hover:-translate-y-2 border border-gray-100"
              >
                <div className="overflow-hidden rounded-xl mb-4">
                  <video
                    aria-label={`Demostración del software ${app.title}`}
                    className="w-full rounded-xl transform hover:scale-[1.02] transition-transform duration-500"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="none"
                    loading="lazy"
                    width="800"
                    height="450"
                    poster="/images/video-placeholder.jpg"
                  >
                    <source src={app.video} type="video/mp4" />
                  </video>
                </div>

                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  {app.title}
                </h3>

                <p className="text-gray-600 mb-4">{app.description}</p>

                <a
                  href="/contacto"
                  className="group inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 active:scale-95"
                >
                  Solicitar demo ahora
                  <span className="text-base transform transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </a>

                <p className="text-xs text-gray-500 mt-1">Respuesta en menos de 24h</p>

                <a
                  href="/contacto"
                  className="block mt-3 text-blue-600 text-sm font-medium underline hover:opacity-80"
                >
                  Ver más detalles →
                </a>
              </div>
            ))}
          </div>

          {/* SOFT CTA */}
          <p className="reveal text-gray-600 text-center mt-24 mb-4">
            ¿Quieres ver ejemplos reales aplicados a proyectos como el tuyo?
          </p>

          {/* SECCIONES EXTERNAS */}
          <AboutSection />
          <TrustSection />
          <TestimonialsSection />

          {/* CTA FINAL */}
          <div className="reveal text-center mt-32">
            <h2 className="text-3xl font-bold mb-4">
              ¿Quieres ver cómo funciona en tu proyecto?
            </h2>

            <p className="text-gray-600 mb-6">
              Te preparamos una demo personalizada sin compromiso.
            </p>

            <a
              href="/contacto"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl text-lg font-medium transition-all duration-300 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 active:scale-95"
            >
              Solicitar demo personalizada
              <span className="text-xl">→</span>
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
