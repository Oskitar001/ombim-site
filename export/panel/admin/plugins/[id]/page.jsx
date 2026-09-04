"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Edit3,
  Trash2,
  Download,
  ExternalLink,
} from "lucide-react";

export default function DetallePluginPage() {
  const params = useParams();
  const id = params?.id;

  const [plugin, setPlugin] = useState(null);
  const [descargas, setDescargas] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function load() {
      const r1 = await fetch(`/api/admin/plugins/${id}`, {
        credentials: "include",
      });
      const d1 = await r1.json();
      setPlugin(d1.plugin);

      const r2 = await fetch("/api/admin/dashboard");
      const d2 = await r2.json();
      setDescargas(d2.descargasPorPlugin?.[id] ?? 0);

      setLoading(false);
    }

    load();
  }, [id]);

  function getYoutubeId(url) {
    if (!url) return null;
    const m1 = url.match(/v=([^&]+)/);
    const m2 = url.match(/youtu\.be\/([^?]+)/);
    return m1 ? m1[1] : m2 ? m2[1] : null;
  }

  if (loading) return <p className="p-4">Cargando plugin…</p>;
  if (!plugin) return <p className="p-4">Plugin no encontrado.</p>;

  const videoId = getYoutubeId(plugin.video_url);

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-8">

      {/* VOLVER */}
      <Link
        href="/panel/admin/plugins"
        className="flex items-center gap-2 text-blue-600 hover:underline"
      >
        <ArrowLeft size={20} /> Volver
      </Link>

      {/* TÍTULO */}
     <h1 className="text-3xl font-bold flex items-center gap-3">
  {plugin.nombre}

  {plugin.version && (
    <span className="bg-blue-600 text-white px-2 py-1 text-sm rounded">
      v{plugin.version}
    </span>
  )}
</h1>

      <div className="bg-white dark:bg-gray-900 rounded-xl border shadow p-6 space-y-6">

        {/* HEADER */}
        <div className="flex gap-6 flex-col sm:flex-row">

          {plugin.imagen_url ? (
            <img
              src={plugin.imagen_url}
              className="w-40 h-40 rounded-lg object-cover shadow"
            />
          ) : (
            <div className="w-40 h-40 bg-gray-400 rounded-lg" />
          )}

          <div className="space-y-3 flex-1">
            <p className="opacity-80">{plugin.descripcion}</p>

            <p className="text-sm flex items-center gap-2">
              <Download size={16} />
              {descargas} descargas
            </p>
          </div>
        </div>

        {/* ✅ PRECIOS PREMIUM */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          {plugin.permite_trimestral && (
            <PriceCard title="Trimestral" price={plugin.precio_trimestral} />
          )}

          {plugin.permite_anual && (
            <PriceCard title="Anual" price={plugin.precio_anual} />
          )}

          {plugin.permite_completa && (
            <PriceCard title="Completa" price={plugin.precio_completa} />
          )}

        </div>

        {/* ✅ VIDEO EMBEBIDO */}
        {videoId && (
          <div className="aspect-video rounded-lg overflow-hidden shadow">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              className="w-full h-full"
              allowFullScreen
            />
          </div>
        )}

        {/* ✅ ARCHIVO */}
        <div className="space-y-2 border-t pt-4">

          {plugin.archivo_url ? (
            <a
              href={plugin.archivo_url}
              target="_blank"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Descargar plugin <ExternalLink size={16} />
            </a>
          ) : (
            <p className="opacity-60">Sin archivo disponible</p>
          )}

        </div>

        {/* ✅ ACCIONES */}
        <div className="flex justify-end gap-4 pt-4 border-t">

          <Link href={`/panel/admin/plugins/editar/${id}`}>
            <button className="px-4 py-2 bg-yellow-400 rounded flex items-center gap-2">
              <Edit3 size={16} /> Editar
            </button>
          </Link>

          <Link href={`/panel/admin/plugins/borrar/${id}`}>
            <button className="px-4 py-2 bg-red-600 text-white rounded flex items-center gap-2">
              <Trash2 size={16} /> Borrar
            </button>
          </Link>

        </div>

      </div>
    </div>
  );
}

/* ✅ CARD PRECIO */
function PriceCard({ title, price }) {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg border shadow-sm text-center">
      <p className="text-sm font-semibold">{title}</p>
      <p className="text-2xl font-bold mt-1 text-blue-600">
        {price > 0 ? `${Number(price).toFixed(2)} €` : "—"}
      </p>
    </div>
  );
}