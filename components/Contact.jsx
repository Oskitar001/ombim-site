'use client'
import { useState } from 'react'
export default function Contact() {
  const [loading, setLoading] = useState(false)
  const [ok, setOk] = useState(null)
  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setOk(null)
    const form = new FormData(e.currentTarget)
    const payload = { nombre: form.get('nombre'), email: form.get('email'), mensaje: form.get('mensaje') }
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      setOk(res.ok)
    } catch { setOk(false) } finally { setLoading(false); e.currentTarget.reset() }
  }
  return (
    <section id="contacto" className="py-20">
      <div className="container mx-auto max-w-3xl">
        <h2 className="text-4xl font-bold text-center mb-12">Contacto</h2>
        <div className="p-8 rounded-2xl border bg-white shadow-sm">
          <form onSubmit={handleSubmit} className="grid gap-6">
            <div>
              <label className="block mb-1 font-medium">Nombre</label>
              <input name="nombre" type="text" required className="w-full p-3 border rounded-lg" placeholder="Tu nombre" />
            </div>
            <div>
              <label className="block mb-1 font-medium">Email</label>
              <input name="email" type="email" required className="w-full p-3 border rounded-lg" placeholder="Tu email" />
            </div>
            <div>
              <label className="block mb-1 font-medium">Mensaje</label>
              <textarea name="mensaje" required className="w-full p-3 border rounded-lg" rows="5" placeholder="Cuéntame qué necesitas"></textarea>
            </div>
              <button
                disabled={loading}
                className="px-6 py-3 text-lg rounded-xl bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-60"
                >
                {loading ? 'Enviando…' : 'Enviar mensaje'}
              </button>
            {ok === true && <p className="text-green-600">¡Gracias! Te responderé pronto.</p>}
            {ok === false && <p className="text-red-600">Hubo un error. Inténtalo de nuevo.</p>}
          </form>
        </div>
      </div>
    </section>
  )
}
