export const metadata = {
  title: "Sobre mí | Óscar Martínez",
  description: "Especialista en Tekla Structures con más de 23 años de experiencia.",
};

export default function SobreMiPage() {
  return (
    <section className="reveal max-w-4xl mx-auto mt-20 mb-32 px-6 text-center">

      <div className="relative inline-block">
        <span className="absolute inset-0 bg-gradient-to-r from-blue-200/40 via-transparent to-blue-200/40 blur-xl rounded-full"></span>

        <h1 className="relative text-5xl md:text-6xl font-bold tracking-tight mb-6">
          Sobre mí
        </h1>
      </div>

      <div className="w-24 h-[3px] bg-blue-600 mx-auto rounded-full mb-12"></div>

      <p className="text-gray-700 leading-relaxed text-lg md:text-xl mb-8">
        Soy <strong>Óscar Martínez</strong>, técnico especialista en Tekla Structures. Durante <strong>23 años</strong> trabajé en <strong>PACADAR (Buñol, Valencia)</strong>, una empresa referente en prefabricado y estructuras. Allí participé en proyectos reales de fabricación, montaje y producción, lo que me dio una visión completa del proceso constructivo.
      </p>

      <p className="text-gray-700 leading-relaxed text-lg md:text-xl mb-8">
        Esa experiencia me permite entender no solo el modelo, sino también las necesidades reales de taller y obra.
      </p>

      <p className="text-gray-700 leading-relaxed text-lg md:text-xl mb-8">
        Desde hace un año trabajo como <strong>autónomo</strong>, colaborando con empresas que necesitan apoyo técnico fiable, rápido y con experiencia real. Además, me especialicé en <strong>programación para Tekla</strong>, creando plugins y automatizaciones que ahorran horas de trabajo y reducen errores.
      </p>

      <p className="text-gray-700 leading-relaxed text-lg md:text-xl">
        Mi objetivo es sencillo: <strong>hacer el trabajo más fácil, más rápido y más preciso</strong>.
      </p>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent mt-20"></div>
    </section>
  );
}
