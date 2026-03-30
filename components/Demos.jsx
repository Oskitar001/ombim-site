"use client";

import Link from "next/link";

export default function Demos() {
  const demos = [
    { title: "Automatización #1", file: "/videos/demo1.mp4" },
    { title: "Generador de Perfiles", file: "/videos/demo2.mp4" },
    { title: "Plugin para Tekla Structures", file: "/videos/demo3.mp4" },
  ];

  return (
    <section id="demos" className="py-20 bg-[#f8f9fb] dark:bg-[#1f1f1f]">
      <div className="max-w-6xl mx-auto px-6">

        {/* TITLE */}
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-gray-900 dark:text-white">
          Demos de mis aplicaciones
        </h2>

        <p className="text-center text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-14 leading-relaxed">
          Estas son algunas de las automatizaciones y herramientas desarrolladas para optimizar el uso de Tekla Structures.
        </p>

        {/* GRID PREMIUM */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {demos.map((d, i) => (
            <div
              key={i}
              className="
                bg-white dark:bg-[#2a2a2a] 
                rounded-2xl shadow-xl 
                p-5 transition hover:shadow-2xl 
                border border-gray-100 dark:border-gray-700
              "
            >
              {/* VIDEO CARD */}
              <div className="relative rounded-xl overflow-hidden mb-4 shadow-lg">
                <video
                  className="w-full h-auto"
                  autoPlay
                  loop
                  muted
                  playsInline
                >
                  <source src={d.file} type="video/mp4" />
                </video>
              </div>

              <h3 className="text-lg font-semibold text-center text-gray-900 dark:text-white">
                {d.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}