const items = [
  { title: "Proyecto 1", desc: "Descripción breve del proyecto realizado." },
  { title: "Proyecto 2", desc: "Descripción breve del proyecto realizado." },
  { title: "Proyecto 3", desc: "Descripción breve del proyecto realizado." },
];

export default function Projects() {
  return (
    <section id="proyectos" className="bg-[#f8f9fb] dark:bg-[#1f1f1f] py-20">
      <div className="max-w-6xl mx-auto px-6">

        {/* TÍTULO */}
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-gray-900 dark:text-white">
          Proyectos
        </h2>

        {/* DESCRIPCIÓN */}
        <p className="text-center text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-14 leading-relaxed">
          Ejemplos de trabajos y soluciones desarrolladas a medida para
          empresas que utilizan Tekla Structures.
        </p>

        {/* GRID PREMIUM */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {items.map((p, i) => (
            <div
              key={i}
              className="
                bg-white dark:bg-[#2a2a2a]
                p-6 rounded-2xl 
                border border-gray-200 dark:border-gray-700
                shadow-lg hover:shadow-2xl 
                transition 
              "
            >
              <h4 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                {p.title}
              </h4>

              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}