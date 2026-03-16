export const metadata = {
  title: "Sobre mí | Óscar Martínez",
  description: "Especialista en Tekla Structures con más de 23 años de experiencia.",
};

export default function SobreMiPage() {
  return (
    <section className="py-24 max-w-4xl mx-auto px-6 bg-white dark:bg-[#111]">
      <h1 className="text-4xl font-bold mb-10 text-center text-gray-900 dark:text-gray-100">
        Sobre mí
      </h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
        Soy <strong>Óscar Martínez</strong>, técnico especialista en Tekla Structures. Durante <strong>23 años</strong> trabajé en <strong>PACADAR (Buñol, Valencia)</strong>, una empresa referente en prefabricado y estructuras. Allí participé en proyectos reales de fabricación, montaje y producción, lo que me dio una visión completa del proceso constructivo.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
        Esa experiencia me permite entender no solo el modelo, sino también las necesidades reales de taller y obra.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
        Desde hace un año trabajo como <strong>autónomo</strong>, colaborando con empresas que necesitan apoyo técnico fiable, rápido y con experiencia real. Además, me especialicé en <strong>programación para Tekla</strong>, creando plugins y automatizaciones que ahorran horas de trabajo y reducen errores.
      </p>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        Mi objetivo es sencillo: <strong>hacer el trabajo más fácil, más rápido y más preciso</strong>.
      </p>
    </section>
  );
}
