export const metadata = {
  title: "Contacto | Óscar Martínez",
  description: "Contacta con Óscar Martínez para colaboraciones en Tekla Structures.",
};

export default function ContactoPage() {
  return (
    <section className="max-w-4xl mx-auto px-6 mt-20 mb-32 bg-[#f3f4f6]Soft dark:bg-[#242424]">
      
      <div className="text-center mb-16">
        <div className="relative inline-block">
          <span className="absolute inset-0 bg-gradient-to-r from-blue-200/40 via-transparent to-blue-200/40 dark:from-blue-900/20 dark:to-blue-900/20 blur-xl rounded-full"></span>

          <h1 className="relative text-5xl md:text-6xl font-bold tracking-tight mb-6 text-[#1f2937] dark:text-[#e6e6e6]">
            Contacto
          </h1>
        </div>

        <div className="w-24 h-[3px] bg-blue-600 mx-auto rounded-full mb-10"></div>

        <p className="text-center text-[#1f2937] dark:text-[#e6e6e6] text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
          ¿Necesitas apoyo en un proyecto o quieres automatizar procesos en Tekla?
          Estoy disponible para colaboraciones por proyecto, por horas o de forma continua.
        </p>
      </div>

      <form
        method="POST"
        action="/api/contact"
        className="grid gap-6 bg-[#f3f4f6]Soft dark:bg-[#1a1a1a] p-10 rounded-2xl shadow-soft border border-[#d1d5db] dark:border-[#3a3a3a]"
      >
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          className="p-4 border border-[#d1d5db] dark:border-gray-600 bg-[#f3f4f6]Soft dark:bg-[#242424] text-[#1f2937] dark:text-[#e6e6e6] rounded-xl text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="p-4 border border-[#d1d5db] dark:border-gray-600 bg-[#f3f4f6]Soft dark:bg-[#242424] text-[#1f2937] dark:text-[#e6e6e6] rounded-xl text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          required
        />

        <textarea
          name="mensaje"
          placeholder="Mensaje"
          rows="5"
          className="p-4 border border-[#d1d5db] dark:border-gray-600 bg-[#f3f4f6]Soft dark:bg-[#242424] text-[#1f2937] dark:text-[#e6e6e6] rounded-xl text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          required
        ></textarea>

        <button
          type="submit"
          className="px-6 py-4 bg-blue-600 text-black dark:text-white rounded-xl font-semibold text-lg hover:bg-blue-700 hover:shadow-xl transition-all active:scale-95"
        >
          Enviar mensaje
        </button>
      </form>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent mt-20"></div>
    </section>
  );
}
