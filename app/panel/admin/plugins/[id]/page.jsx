"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PluginDetalleAdmin() {
  const { id } = useParams();
  const [plugin, setPlugin] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    async function load() {
      const res = await fetch(`/api/plugin/${id}`, {
        credentials: "include", // 🔥 FIX: proteger ruta admin
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError("No se pudo cargar el plugin.");
        setPlugin(null);
        return;
      }

      // 🔥 Normalizamos datos por seguridad
      setPlugin({
        ...data,
        nombre: data.nombre ?? "",
        descripcion: data.descripcion ?? "",
        precio: Number(data.precio ?? 0),
        precio_anual: Number(data.precio_anual ?? 0),
        precio_completa: Number(data.precio_completa ?? 0),
        imagen_url: data.imagen_url ?? "",
        archivo_url: data.archivo_url ?? "",
        video_url: data.video_url ?? "",
        version: data.version ?? "1.0",
      });
    }

    load();
  }, [id]);

  if (error) return <p className="p-4 text-red-600">{error}</p>;
  if (!plugin) return <p className="p-4">Cargando plugin…</p>;

  return (
    <div className="space-y-6 p-4 max-w-2xl mx-auto">
      <Link
        href="/panel/admin/plugins"
        className="flex items-center gap-2 text-blue-600"
      >
        <ArrowLeft size={18} /> Volver
      </Link>

      <h1 className="text-3xl font-bold">{plugin.nombre}</h1>

      {plugin.imagen_url ? (
        <img
          src={plugin.imagen_url}
          alt={plugin.nombre}
          className="w-64 h-64 object-cover rounded shadow"
        />
      ) : (
        <div className="w-64 h-64 bg-gray-400 rounded" />
      )}

      <p className="opacity-80">{plugin.descripcion}</p>

      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 shadow space-y-2">
        <p>
          <strong>Estándar:</strong>{" "}
          {plugin.precio > 0 ? `${plugin.precio} €` : "—"}
        </p>
        <p>
          <strong>Anual:</strong>{" "}
          {plugin.precio_anual > 0 ? `${plugin.precio_anual} €` : "—"}
        </p>
        <p>
          <strong>Completa:</strong>{" "}
          {plugin.precio_completa > 0
            ? `${plugin.precio_completa} €`
            : "—"}
        </p>
      </div>

      <p>
        <strong>Archivo:</strong>{" "}
        {plugin.archivo_url ? plugin.archivo_url.split("/").pop() : "—"}
      </p>

      <p>
        <strong>Video:</strong> {plugin.video_url || "—"}
      </p>

      <p>
        <strong>Versión:</strong> {plugin.version}
      </p>
    </div>
  );
}