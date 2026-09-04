export const metadata = {
  title: "Contacto – Óscar Martínez",
  description: "Contacta con Óscar Martínez para colaboraciones en Tekla Structures.",
};

export default function ContactoPage() {
  return (
    <section className="pt-24 pb-20 max-w-3xl mx-auto px-6">
      <h1 className="text-3xl font-bold mb-6">Contacto</h1>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
        ¿Necesitas apoyo en un proyecto o quieres automatizar procesos en Tekla?
        Estoy disponible para colaboraciones por proyecto, por horas o de forma continua.
      </p>

      <form className="space-y-6 bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow">
        <div>
          <label className="block mb-1 font-semibold">Nombre</label>
          <input
            type="text"
            className="w-full p-2 rounded border dark:bg-gray-900"
            placeholder="Tu nombre"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Email</label>
          <input
            type="email"
            className="w-full p-2 rounded border dark:bg-gray-900"
            placeholder="tu@email.com"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Mensaje</label>
          <textarea
            className="w-full p-2 rounded border h-32 dark:bg-gray-900"
            placeholder="Cuéntame cómo puedo ayudarte"
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Enviar mensaje
        </button>
      </form>
    </section>
  );
}
