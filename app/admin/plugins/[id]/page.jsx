"use client";

import { useEffect, useState } from "react";

export default function EditarPlugin({ params }) {
  const [plugin, setPlugin] = useState(null);

  useEffect(() => {
    fetch(`/api/admin/plugins/${params.id}`)
      .then((res) => res.json())
      .then((data) => setPlugin(data));
  }, []);

  const handleChange = (e) =>
    setPlugin({ ...plugin, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch(`/api/admin/plugins/${params.id}`, {
      method: "PUT",
      body: JSON.stringify(plugin),
    });

    window.location.href = "/admin/plugins";
  };

  const handleDelete = async () => {
    if (!confirm("¿Seguro que quieres eliminar este plugin?")) return;

    await fetch(`/api/admin/plugins/${params.id}`, {
      method: "DELETE",
    });

    window.location.href = "/admin/plugins";
  };

  if (!plugin) return <div className="p-10">Cargando...</div>;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Editar Plugin</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 max-w-xl">
        <input
          name="nombre"
          value={plugin.nombre}
          onChange={handleChange}
          className="border p-2"
        />

        <textarea
          name="descripcion"
          value={plugin.descripcion}
          onChange={handleChange}
          className="border p-2"
        />

        <input
          name="video_url"
          value={plugin.video_url}
          onChange={handleChange}
          className="border p-2"
        />

        <input
          name="demo_url"
          value={plugin.demo_url}
          onChange={handleChange}
          className="border p-2"
        />

        <input
          name="imagen_url"
          value={plugin.imagen_url}
          onChange={handleChange}
          className="border p-2"
        />

        <input
          name="precio"
          value={plugin.precio}
          onChange={handleChange}
          className="border p-2"
        />

        <input
          name="stripe_price_id"
          value={plugin.stripe_price_id}
          onChange={handleChange}
          className="border p-2"
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Guardar cambios
        </button>
      </form>

      <button
        onClick={handleDelete}
        className="bg-red-600 text-white px-4 py-2 rounded mt-6"
      >
        Eliminar plugin
      </button>
    </div>
  );
}
