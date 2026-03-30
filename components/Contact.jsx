export default function Contact() {
  return (
    <section
      id="contacto"
      className="py-20 md:py-28 max-w-3xl mx-auto px-6 text-center"
    >
      {/* TÍTULO */}
      <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#1f2937] dark:text-white">
        Contacto
      </h2>

      {/* DESCRIPCIÓN */}
      <p className="text-base md:text-lg text-[#1f2937] dark:text-gray-300 opacity-90 max-w-2xl mx-auto mb-12 leading-relaxed">
        ¿Necesitas apoyo en un proyecto o quieres automatizar procesos en Tekla?
        Estoy disponible para colaboraciones por proyecto, por horas o de forma
        continua.
      </p>

      {/* FORMULARIO PREMIUM */}
      <form
        method="POST"
        action="/api/contact"
        className="grid gap-5 bg-white dark:bg-[#2a2a2a] p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          required
          className="
            w-full p-3 rounded-lg
            bg-gray-100 dark:bg-[#3a3a3a]
            border border-gray-300 dark:border-gray-600
            focus:ring-2 focus:ring-blue-600 focus:border-blue-600
            transition
          "
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="
            w-full p-3 rounded-lg
            bg-gray-100 dark:bg-[#3a3a3a]
            border border-gray-300 dark:border-gray-600
            focus:ring-2 focus:ring-blue-600 focus:border-blue-600
            transition
          "
        />

        <textarea
          name="mensaje"
          placeholder="Mensaje"
          rows="5"
          required
          className="
            w-full p-3 rounded-lg
            bg-gray-100 dark:bg-[#3a3a3a]
            border border-gray-300 dark:border-gray-600
            focus:ring-2 focus:ring-blue-600 focus:border-blue-600
            transition
          "
        />

        <button
          type="submit"
          className="
            w-full py-3 rounded-lg 
            bg-blue-600 hover:bg-blue-700
            text-white font-semibold text-lg
            shadow-md hover:shadow-lg
            transition
          "
        >
          Enviar mensaje
        </button>
      </form>
    </section>
  );
}