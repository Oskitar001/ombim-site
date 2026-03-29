"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Download, Tag } from "lucide-react";

export default function PluginClient({ plugin }) {
  const [user, setUser] = useState(null);
  const [plan, setPlan] = useState("normal"); // normal | anual | completa

  if (!plugin) {
    return <p className="p-4">Plugin no encontrado.</p>;
  }

  const pluginId = plugin.id;

  // ================================
  // CARGAR USUARIO LOGUEADO
  // ================================
  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setUser(d.user ?? null));
  }, []);

  // ================================
  // NORMALIZAR PRECIOS (🔥 OBLIGATORIO)
  // ================================
  const precioNormal = Number(plugin.precio) || 0;
  const precioAnual = Number(plugin.precio_anual) || 0;
  const precioCompleta = Number(plugin.precio_completa) || 0;

  const precios = {
    normal: precioNormal,
    anual: precioAnual,
    completa: precioCompleta,
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 mt-6">

      {/* TÍTULO + VERSIÓN */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{plugin.nombre}</h1>

        {plugin.version && (
          <span className="bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1">
            <Tag size={14} />
            v{plugin.version}
          </span>
        )}
      </div>

      {/* ❌ FOTO ELIMINADA */}

      {/* DESCRIPCIÓN */}
      <p className="opacity-80 text-lg leading-relaxed">
        {plugin.descripcion}
      </p>

      {/* VIDEO */}
      {plugin.video_url && (
        <div className="aspect-video w-full overflow-hidden rounded-lg shadow">
          <iframe
            src={plugin.video_url}
            className="w-full h-full"
            allowFullScreen
          />
        </div>
      )}

      {/* SELECTOR DE PLAN */}
      <div className="border rounded-lg p-4 space-y-4 bg-gray-100 dark:bg-gray-900 shadow">
        <h2 className="text-xl font-semibold mb-2">Tipo de licencia</h2>

        <div className="flex flex-wrap gap-3">

          {/* NORMAL */}
          <button
            onClick={() => setPlan("normal")}
            className={`px-4 py-2 rounded font-medium border ${
              plan === "normal"
                ? "bg-blue-600 text-white border-blue-700"
                : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700"
            }`}
          >
            Licencia estándar
          </button>

          {/* ANUAL */}
          {precioAnual > 0 && (
            <button
              onClick={() => setPlan("anual")}
              className={`px-4 py-2 rounded font-medium border ${
                plan === "anual"
                  ? "bg-blue-600 text-white border-blue-700"
                  : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700"
              }`}
            >
              Suscripción anual
            </button>
          )}

          {/* COMPLETA */}
          {precioCompleta > 0 && (
            <button
              onClick={() => setPlan("completa")}
              className={`px-4 py-2 rounded font-medium border ${
                plan === "completa"
                  ? "bg-blue-600 text-white border-blue-700"
                  : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700"
              }`}
            >
              Licencia completa
            </button>
          )}
        </div>

        {/* PRECIO DEL PLAN SELECCIONADO */}
        <div className="text-3xl font-bold mt-4">
          {precios[plan] > 0 ? `${precios[plan]} €` : "Gratis"}
        </div>

        {/* CTA / COMPRAR / TRIAL */}
        {user ? (
          <>
            {/* BOTÓN COMPRAR */}
            {precios[plan] > 0 ? (
              <Link
                href={`/pago/${pluginId}?plan=${plan}`}
                className="block bg-blue-600 text-white text-center px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition mt-4"
              >
                Comprar{" "}
                {plan === "anual"
                  ? "suscripción anual"
                  : plan === "completa"
                  ? "licencia completa"
                  : "licencia estándar"}{" "}
                →
              </Link>
            ) : (
              <p className="text-green-600 font-semibold mt-2">
                Este plugin es gratuito.
              </p>
            )}

            {/* DESCARGAR TRIAL */}
            <a
              href={`/api/plugin/download?plugin_id=${pluginId}`}
              className="mt-3 inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              <Download size={18} /> Descargar versión Trial
            </a>
          </>
        ) : (
          <Link
            href="/login"
            className="bg-gray-500 text-white px-4 py-2 rounded inline-block mt-3 hover:bg-gray-600"
          >
            Iniciar sesión para comprar o descargar
          </Link>
        )}
      </div>
    </div>
  );
}