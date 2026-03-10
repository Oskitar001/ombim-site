import { useState } from "react";

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = {
      nombre: e.target.nombre.value,
      email: e.target.email.value,
      mensaje: e.target.mensaje.value,
    };

    const res = await fetch("/api/contact", {
      method: "POST",
      body: JSON.stringify(formData),
    });

    setOk(res.ok);
    setLoading(false);
  };

  return (
    <section id="contacto" className="py-20 bg-gray-100">
      <div className="container mx-auto max-w-3xl px-6">
        <div className="bg-white p-10 rounded-2xl shadow-soft">
          <h2 className="text-3xl font-bold mb-6 text-center">Contacto</h2>

          <form onSubmit={handleSubmit} className="grid gap-6">
            <div>
              <label className="block mb-1 font-medium">Nombre</label>
              <input
                name="nombre"
                type="text"
                required
                className="w-full p-3 border rounded-lg"
                placeholder="Tu nombre"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Email</label>
              <input
                name="email"
                type="email"
                required
                className="w-full p-3 border rounded-lg"
                placeholder="Tu email"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Mensaje</label>
              <textarea
                name="mensaje"
                required
                className="w-full p-3 border rounded-lg"
                rows="5"
                placeholder="Cuéntame qué necesitas"
              ></textarea>
            </div>

            <button
              disabled={loading}
              className="w-full px-6 py-3 text-lg rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-soft transition-all active:scale-95 disabled:opacity-60"
            >
              {loading ? "Enviando…" : "Enviar mensaje"}
            </button>

            {ok === true && (
              <p className="text-green-600 text-center">
                ¡Gracias! Te responderé pronto.
              </p>
            )}
            {ok === false && (
              <p className="text-red-600 text-center">
                Hubo un error. Inténtalo de nuevo.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
