// components/Demos.jsx

"use client";

export default function Demos() {
  const demos = [
    { title: "Automatización #1", file: "/videos/demo1.mp4" },
    { title: "Generador de Perfiles", file: "/videos/demo2.mp4" },
    { title: "Plugin para Tekla Structures", file: "/videos/demo3.mp4" },
  ];

  return (
    <section id="demos" className="py-20 bg-[#f3f4f6]">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">
          Demos de mis aplicaciones
        </h2>
        <p className="text-center text-[#1f2937] max-w-2xl mx-auto mb-12">
          Estas son algunas de las automatizaciones y herramientas desarrolladas para optimizar el uso de Tekla Structures.
        </p>

        <div className="grid md:grid-cols-3 gap-10">
          {demos.map((d, i) => (
            <div key={i} className="p-5 bg-[#f3f4f6]Soft rounded-2xl shadow">
              <video
                className="w-full rounded-xl mb-4"
                autoPlay
                loop
                muted
                playsInline
              >
                <source src={d.file} type="video/mp4" />
              </video>
              <h3 className="text-xl font-semibold text-center">{d.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
