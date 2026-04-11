export const metadata = {
  title: "Sobre mí | Óscar Martínez",
  description:
    "Especialista en Tekla Structures con más de 23 años de experiencia real en producción, prefabricado y estructuras.",
};

export default function SobreMiPage() {
  return (
    <section className="py-24 max-w-4xl mx-auto px-6 bg-[#f3f4f6] dark:bg-[#242424]">
      
      <h1 className="text-4xl font-bold mb-10 text-center text-[#1f2937] dark:text-[#e6e6e6]">
        Sobre mí
      </h1>

      <p className="text-[#1f2937] dark:text-[#e6e6e6] leading-relaxed mb-6">
        Soy <strong>Óscar Martínez</strong>, especialista en Tekla Structures con
        más de <strong>23 años de experiencia real</strong> en el sector de las
        estructuras y el prefabricado de hormigón. Durante ese tiempo trabajé en
        <strong> PACADAR (Buñol, Valencia)</strong>, una empresa referente en el
        sector, participando directamente en proyectos de fabricación, montaje
        y producción.
      </p>

      <p className="text-[#1f2937] dark:text-[#e6e6e6] leading-relaxed mb-6">
        Esta experiencia me permitió adquirir una visión completa del proceso
        constructivo, entendiendo no solo el modelo, sino también las
        necesidades reales de la oficina técnica, el taller y la obra.
      </p>

      <p className="text-[#1f2937] dark:text-[#e6e6e6] leading-relaxed mb-6">
        Desde hace un año colaboro como <strong>profesional autónomo</strong> con
        empresas que necesitan apoyo técnico fiable, rápido y con experiencia
        real en Tekla Structures. Como parte de este trabajo, me especialicé en
        <strong> desarrollo y programación para Tekla</strong>, creando plugins
        y automatizaciones que ayudan a reducir errores y ahorrar horas de
        trabajo en proyectos reales.
      </p>

      <p className="text-[#1f2937] dark:text-[#e6e6e6] leading-relaxed">
        Mi objetivo es sencillo y práctico:{" "}
        <strong>
          hacer el trabajo más fácil, más rápido y más preciso
        </strong>.
      </p>

    </section>
  );
}