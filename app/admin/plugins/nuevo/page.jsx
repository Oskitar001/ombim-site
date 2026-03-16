"use client";

import { useState, useEffect } from "react";

export default function NuevoPlugin() {
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    video_url: "",
    demo_url: "",
    imagen_url: "",
    precio: "",
    categoria_id: "",
  });

  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetch("/api/admin/categorias/list")
      .then((res) => res.json())
      .then((data) => setCategorias(data));
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const stripeRes = await fetch("/api/admin/plugins/stripe", {
        method: "POST",
        body: JSON.stringify({
          nombre: form.nombre,
          precio: Number(form.precio),
        }),
      });

      const stripeData = await stripeRes.json();

      await fetch("/api/admin/plugins", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          precio: Number(form.precio),
          stripe_price_id: stripeData.price_id,
        }),
      });

      window.location.href = "/admin/plugins";
    } catch (err) {
      setErrorMsg(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Nuevo Plugin</h1>

      {errorMsg && <div className="mb-4 text-red-600">{errorMsg}</div>}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 max-w-xl">
        <input name="nombre" placeholder="Nombre" onChange={handleChange} className="border p-2" required />

        <textarea name="descripcion" placeholder="Descripción" onChange={handleChange} className="border p-2" rows={4} />

        <input name="video_url" placeholder="URL del video (YouTube)" onChange={handleChange} className="border p-2" />

        <input name="demo_url" placeholder="URL de descarga demo" onChange={handleChange} className="border p-2" />

        <input name="imagen_url" placeholder="URL de imagen" onChange={handleChange} className="border p-2" />

        <input name="precio" type="number" step="0.01" min="0" placeholder="Precio (€)" onChange={handleChange} className="border p-2" required />

        {/* SELECTOR DE CATEGORÍA */}
        <select name="categoria_id" onChange={handleChange} className="border p-2">
          <option value="">Seleccionar categoría</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>

        <button disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded">
          {loading ? "Creando plugin..." : "Guardar"}
        </button>
      </form>
    </div>
  );
}
