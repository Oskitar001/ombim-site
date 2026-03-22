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

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/admin/plugins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ nombre, descripcion, precio, archivo_url: archivoUrl, video_url: videoUrl }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Error al crear plugin");
      return;
    }

    router.push("/panel/admin/plugins");
  };

  return (
    <div className="max-w-2xl mx-auto pt-32 px-6">
      <h1 className="text-2xl font-bold mb-4">Nuevo plugin</h1>

      <form onSubmit={submit} className="space-y-3">
        <input
          className="border p-2 w-full rounded"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <textarea
          className="border p-2 w-full rounded"
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
        <input
          type="number"
          className="border p-2 w-full rounded"
          placeholder="Precio (€)"
          value={precio}
          onChange={(e) => setPrecio(Number(e.target.value))}
        />
        <input
          className="border p-2 w-full rounded"
          placeholder="URL archivo (Supabase Storage, etc.)"
          value={archivoUrl}
          onChange={(e) => setArchivoUrl(e.target.value)}
        />
        <input
          className="border p-2 w-full rounded"
          placeholder="URL vídeo (opcional)"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
        />

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Guardar
        </button>

        {error && <p className="text-red-600 mt-2">{error}</p>}
      </form>
    </div>
  );
}
