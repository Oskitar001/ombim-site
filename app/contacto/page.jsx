export const metadata = {
  title: "Contacto | Óscar Martínez",
  description: "Contacta con Óscar Martínez para colaboraciones en Tekla Structures.",
};

export default function ContactoPage() {
  return (
    <section className="max-w-4xl mx-auto px-6 mt-40 mb-32">

      {/* TÍTULO PREMIUM */}
      <div className="text-center mb-16">
        <div className="relative inline-block">
          <span className="absolute inset-0 bg-gradient-to-r from-blue-200/40 via-transparent to-blue-200/40 blur-xl rounded-full"></span>

          <h1 className="relative text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Contacto
          </h1>
        </div>

        {/* LÍNEA TÉCNICA */}
        <div className="w-24 h-[3px] bg-blue-600 mx-auto rounded-full mb-10"></div>

        {/* TEXTO ORIGINAL */}
        <p className="text-center text-gray-700 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
          ¿Necesitas apoyo en un proyecto o quieres automatizar procesos en Tekla?
          Estoy disponible para colaboraciones por proyecto, por horas o de forma continua.
        </p>
      </div>

      {/* FORMULARIO PREMIUM */}
      <form
        method="POST"
        action="/api/contact"
        className="grid gap-6 bg-white p-10 rounded-2xl shadow-soft border border-gray-200"
      >
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          className="p-4 border border-gray-300 rounded-xl text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="p-4 border border-gray-300 rounded-xl text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          required
        />

        <textarea
          name="mensaje"
          placeholder="Mensaje"
          rows="5"
          className="p-4 border border-gray-300 rounded-xl text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          required
        ></textarea>

        <button
          type="submit"
          className="px-6 py-4 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700 hover:shadow-xl transition-all active:scale-95"
        >
          Enviar mensaje
        </button>
      </form>

      {/* SEPARADOR PREMIUM */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent mt-20"></div>
    </section>
  );
}
