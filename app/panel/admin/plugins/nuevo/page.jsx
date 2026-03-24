// /app/panel/admin/plugins/nuevo/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NuevoPluginPage() {
  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState(0);
  const [archivoUrl, setArchivoUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/admin/plugins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        nombre,
        descripcion,
        precio: Number(precio),
        archivo_url: archivoUrl,
        video_url: videoUrl,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Error al crear plugin");
      return;
    }

    router.push("/panel/admin/plugins");
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-xl font-bold mb-4">Nuevo plugin</h1>

      <form onSubmit={submit} className="space-y-4">

        <div>
          <label className="block mb-1">Nombre</label>
          <input
            type="text"
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="block mb-1">Descripción</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="border p-2 rounded w-full h-28"
          />
        </div>

        <div>
          <label className="block mb-1">Precio (€)</label>
          <input
            type="number"
            value={precio}
            min={0}
            step={0.01}
            onChange={(e) => setPrecio(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="block mb-1">Archivo URL (descarga)</label>
          <input
            type="text"
            value={archivoUrl}
            onChange={(e) => setArchivoUrl(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="block mb-1">Video URL (opcional)</label>
          <input
            type="text"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Guardando..." : "Guardar"}
        </button>

        {error && (
          <p className="text-red-600 mt-2">{error}</p>
        )}
      </form>
    </div>
  );
}