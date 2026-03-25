"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PluginDetalleAdmin({ params }) {
  const { id } = use(params);
  const [plugin, setPlugin] = useState(null);

  useEffect(() => {
    async function load() {
      const r = await fetch(`/api/plugin/${id}`);
      const d = await r.json();
      setPlugin(d);
    }
    load();
  }, [id]);

  if (!plugin) return <p className="p-4">Cargando...</p>;

  return (
    <div className="space-y-6 p-4">
      <Link href="/panel/admin/plugins" className="flex items-center gap-2">
        <ArrowLeft size={20} /> Volver
      </Link>

      <h1 className="text-3xl font-bold">{plugin.nombre}</h1>

      {plugin.imagen_url && (
        <img
          src={plugin.imagen_url}
          alt={plugin.nombre}
          className="w-64 h-64 object-cover rounded shadow"
        />
      )}

      <p>{plugin.descripcion}</p>
      <p><strong>Precio:</strong> {plugin.precio} €</p>
      <p><strong>Archivo:</strong> {plugin.archivo_url}</p>
      <p><strong>Video:</strong> {plugin.video_url ?? "N/A"}</p>
      <p><strong>Versión:</strong> {plugin.version ?? "1.0.0"}</p>
    </div>
  );
}
