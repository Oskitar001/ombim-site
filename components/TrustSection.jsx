"use client";

export default function TrustSection() {
  return (
    <section className="py-16 max-w-6xl mx-auto px-6 reveal">
      <div className="grid md:grid-cols-3 gap-10 text-center">

        <div>
          <h4 className="text-xl font-bold mb-2">+10 años de experiencia</h4>
          <p className="opacity-80">
            Desarrollando soluciones BIM para estructuras metálicas y de hormigón,
            con enfoque práctico y orientado al trabajo real.
          </p>
        </div>

        <div>
          <h4 className="text-xl font-bold mb-2">Software usado por empresas reales</h4>
          <p className="opacity-80">
            Más de 40 empresas utilizan mis herramientas y automatizaciones para acelerar
            su producción y mejorar sus flujos internos.
          </p>
        </div>

        <div>
          <h4 className="text-xl font-bold mb-2">Soluciones a medida</h4>
          <p className="opacity-80">
            Desarrollo herramientas totalmente personalizadas adaptadas a las necesidades
            reales de cada empresa.
          </p>
        </div>

      </div>
    </section>
  );
}