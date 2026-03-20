const items = [
  { title: 'Proyecto 1', desc: 'Descripción breve del proyecto realizado.' },
  { title: 'Proyecto 2', desc: 'Descripción breve del proyecto realizado.' },
  { title: 'Proyecto 3', desc: 'Descripción breve del proyecto realizado.' },
]
export default function Projects() {
  return (
    <section id="proyectos" className="bg-[#f3f4f6] py-20">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">Proyectos</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {items.map((p, i) => (
            <div key={i} className="p-6 rounded-2xl border bg-[#f3f4f6]Soft shadow-sm text-center">
              <h4 className="font-semibold mb-2">{p.title}</h4>
              <p className="text-[#1f2937]">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
