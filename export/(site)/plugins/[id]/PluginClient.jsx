"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Download, Tag } from "lucide-react";

export default function PluginClient({ plugin }) {
  const [user, setUser] = useState(null);
  const [plan, setPlan] = useState("trimestral");
  const [playVideo, setPlayVideo] = useState(false);

  if (!plugin) {
    return <p className="p-4">Plugin no encontrado.</p>;
  }

  const pluginId = plugin.id;

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setUser(d.user ?? null));
  }, []);

  // ✅ PRECIOS
  const precioTrimestral = Number(plugin.precio_trimestral) || 0;
  const precioAnual = Number(plugin.precio_anual) || 0;
  const precioCompleta = Number(plugin.precio_completa) || 0;

  const precios = {
    trimestral: precioTrimestral,
    anual: precioAnual,
    completa: precioCompleta,
  };

  const base = precios[plan] || 0;
  const iva = base * 0.21;
  const total = base + iva;

  // ✅ VIDEO HELPERS
  function getYoutubeId(url) {
    if (!url) return null;

    const m1 = url.match(/v=([^&]+)/);
    const m2 = url.match(/youtu\.be\/([^?]+)/);

    return m1 ? m1[1] : m2 ? m2[1] : null;
  }

  const videoId = getYoutubeId(plugin.video_url);

  return (
    <div className="max-w-4xl mx-auto space-y-6 mt-6">

      {/* TÍTULO */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{plugin.nombre}</h1>

        {plugin.version && (
          <span className="bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1">
            <Tag size={14} />
            v{plugin.version}
          </span>
        )}
      </div>

      {/* DESCRIPCIÓN */}
      <p className="opacity-80 text-lg">{plugin.descripcion}</p>

      {/* ✅ VIDEO PRO PREVIEW */}
      {videoId && (
        <div className="aspect-video w-full rounded-lg overflow-hidden shadow relative">

          {!playVideo ? (
            <div
              className="relative cursor-pointer group"
              onClick={() => setPlayVideo(true)}
            >
              {/* THUMBNAIL */}
              <img
                src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                alt="Video preview"
                className="w-full h-full object-cover"
              />

              {/* BOTÓN PLAY */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/80 rounded-full p-4 group-hover:scale-110 transition">
                  ▶
                </div>
              </div>

              {/* OVERLAY */}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition" />
            </div>
          ) : (
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              className="w-full h-full"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          )}
        </div>
      )}

      {/* PLANES */}
      <div className="border rounded-lg p-4 space-y-4 bg-gray-100 dark:bg-gray-900 shadow">
        <h2 className="text-xl font-semibold">Tipo de licencia</h2>

        <div className="flex flex-wrap gap-3">

          {precioTrimestral > 0 && (
            <button
              onClick={() => setPlan("trimestral")}
              className={`px-4 py-2 rounded border ${
                plan === "trimestral"
                  ? "bg-blue-600 text-white"
                  : "bg-white dark:bg-gray-800"
              }`}
            >
              Trimestral
            </button>
          )}

          {precioAnual > 0 && (
            <button
              onClick={() => setPlan("anual")}
              className={`px-4 py-2 rounded border ${
                plan === "anual"
                  ? "bg-blue-600 text-white"
                  : "bg-white dark:bg-gray-800"
              }`}
            >
              Anual
            </button>
          )}

          {precioCompleta > 0 && (
            <button
              onClick={() => setPlan("completa")}
              className={`px-4 py-2 rounded border ${
                plan === "completa"
                  ? "bg-blue-600 text-white"
                  : "bg-white dark:bg-gray-800"
              }`}
            >
              Completa
            </button>
          )}
        </div>

        {/* PRECIOS */}
        <div className="space-y-1">
          <div className="text-lg font-semibold">
            Precio base: {base.toFixed(2)} €
          </div>
          <div>IVA (21%): {iva.toFixed(2)} €</div>
          <div className="text-3xl font-bold">
            TOTAL: {total.toFixed(2)} €
          </div>
        </div>

        {/* BOTONES */}
        {user ? (
          <>
            {base > 0 ? (
              <Link
                href={`/pago/${pluginId}?plan=${plan}`}
                className="block bg-blue-600 text-white text-center px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 mt-4"
              >
                Comprar{" "}
                {plan === "trimestral"
                  ? "licencia trimestral"
                  : plan === "anual"
                  ? "suscripción anual"
                  : "licencia completa"} →
              </Link>
            ) : (
              <p className="text-green-600 font-semibold">
                Este plugin es gratuito.
              </p>
            )}

            <a
              href={`/api/plugin/download?plugin_id=${pluginId}`}
              className="mt-3 inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              <Download size={18} />
              Descargar versión Trial
            </a>
          </>
        ) : (
          <Link
            href="/login"
            className="bg-gray-500 text-white px-4 py-2 rounded inline-block mt-3"
          >
            Iniciar sesión para comprar o descargar
          </Link>
        )}
      </div>
    </div>
  );
}
