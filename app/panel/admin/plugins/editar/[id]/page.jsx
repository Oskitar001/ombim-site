"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function EditarPluginPage({ params }) {
  const { id } = use(params); // ✔ Next.js 16 correcto

  const [form, setForm] = useState(null);

  useEffect(() => {
    async function load() {
      const r = await fetch(`/api/plugin/${id}`);
      const d = await r.json();
      setForm({
        nombre: d.nombre,
        descripcion: d.descripcion,
        precio: d.precio,
        archivo_url: d.archivo_url,
        video_url: d.video_url,
        imagen_url: d.imagen_url,
        version: d.version ?? "1.0.0",
      });
    }
    load();
  }, [id]);

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function guardar() {
    await fetch("/api/admin/plugins/editar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...form }),
    });

    window.location.href = "/panel/admin/plugins";
  }

  if (!form) return <p className="p-4">Cargando...</p>;

  return (
    <div className="space-y-6 p-4 max-w-xl mx-auto">
      <Link href="/panel/admin/plugins" className="flex items-center gap-2">
        <ArrowLeft size={20} /> Volver
      </Link>

      <h1 className="text-3xl font-bold">Editar Plugin</h1>

      <div className="space-y-4">
        <div>
          <label>Nombre</label>
          <input
            className="w-full p-2 rounded border dark:bg-gray-900"
            value={form.nombre}
            onChange={(e) => update("nombre", e.target.value)}
          />
        </div>

        <div>
          <label>Descripción</label>
          <textarea
            className="w-full p-2 rounded border dark:bg-gray-900"
            rows={4}
            value={form.descripcion}
            onChange={(e) => update("descripcion", e.target.value)}
          />
        </div>

        <div>
          <label>Precio (€)</label>
          <input
            type="number"
            className="w-full p-2 rounded border dark:bg-gray-900"
            value={form.precio}
            onChange={(e) => update("precio", parseFloat(e.target.value))}
          />
        </div>

        <div>
          <label>Archivo (.zip)</label>
          <input
            className="w-full p-2 rounded border dark:bg-gray-900"
            value={form.archivo_url}
            onChange={(e) => update("archivo_url", e.target.value)}
          />
        </div>

        <div>
          <label>Video URL</label>
          <input
            className="w-full p-2 rounded border dark:bg-gray-900"
            value={form.video_url}
            onChange={(e) => update("video_url", e.target.value)}
          />
        </div>

        <div>
          <label>Imagen URL</label>
          <input
            className="w-full p-2 rounded border dark:bg-gray-900"
            value={form.imagen_url}
            onChange={(e) => update("imagen_url", e.target.value)}
          />
        </div>

        <div>
          <label>Versión</label>
          <input
            className="w-full p-2 rounded border dark:bg-gray-900"
            value={form.version}
            onChange={(e) => update("version", e.target.value)}
          />
        </div>

        <button
          onClick={guardar}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
        >
          Guardar Cambios
        </button>
      </div>
    </div>
  );
}