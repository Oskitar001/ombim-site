"use client";

export default function TrustSection() {
  return (
    <section className="py-16 max-w-6xl mx-auto px-6 reveal">
      <div className="grid md:grid-cols-3 gap-10 text-center">

        <div>
          <h4 className="text-xl font-bold mb-2">
            Más de 23 años de experiencia real
          </h4>
          <p className="opacity-80">
            Trabajando en proyectos reales de estructuras metálicas y
            prefabricado de hormigón, desde la ingeniería hasta la fabricación
            y el montaje.
          </p>
        </div>

        <div>
          <h4 className="text-xl font-bold mb-2">
            Tekla adaptado al trabajo real
          </h4>
          <p className="opacity-80">
            No me adapto al software: adapto el software a la empresa, creando
            flujos de trabajo ágiles y productivos ajustados a su forma real
            de trabajar.
          </p>
        </div>

        <div>
          <h4 className="text-xl font-bold mb-2">
            Herramientas usadas en producción diaria
          </h4>
          <p className="opacity-80">
            Muchas empresas utilizan mis automatizaciones y herramientas
            propias para acelerar su producción, reducir errores y mejorar
            sus flujos internos.
          </p>
        </div>

      </div>
    </section>
  );
}