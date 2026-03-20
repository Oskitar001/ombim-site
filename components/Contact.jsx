export default function Contact() {
  return (
    <section id="contacto" className="py-24 max-w-4xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-10">Contacto</h2>

      <p className="text-center text-[#1f2937] mb-10">
        ¿Necesitas apoyo en un proyecto o quieres automatizar procesos en Tekla?  
        Estoy disponible para colaboraciones por proyecto, por horas o de forma continua.
      </p>

      <form method="POST" action="/api/contact" className="grid gap-6">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          className="p-3 border rounded-lg"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="p-3 border rounded-lg"
          required
        />

        <textarea
          name="mensaje"
          placeholder="Mensaje"
          rows="5"
          className="p-3 border rounded-lg"
          required
        ></textarea>

        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-black rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Enviar mensaje
        </button>
      </form>
    </section>
  );
}
