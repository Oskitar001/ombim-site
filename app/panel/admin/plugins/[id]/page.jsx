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

  /* ============================
      CARGAR DATOS DEL PLUGIN
  ============================ */
  useEffect(() => {
    if (!id) return;

    async function load() {
      try {
        // 🔥 CORRECTO: ruta admin creada y validada
        const r1 = await fetch(`/api/admin/plugins/${id}`, {
          credentials: "include",
        });
        const d1 = await r1.json();

        if (!r1.ok) {
          alert(d1.error ?? "Error cargando plugin");
          return;
        }

        // 🔥 FIX: el backend devuelve { plugin: {...} }
        setPlugin(d1.plugin);

        // Obtener descargas
        const r2 = await fetch("/api/admin/dashboard", {
          credentials: "include",
        });
        const d2 = await r2.json();

        setDescargas(d2.descargasPorPlugin?.[id] ?? 0);
      } catch (e) {
        alert("Error conectando con el servidor.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  if (loading) return <p className="p-4">Cargando plugin…</p>;
  if (!plugin) return <p className="p-4">Plugin no encontrado.</p>;

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-8">

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
      </h1>

      {/* CARD PRINCIPAL */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-300 dark:border-gray-700 shadow p-6 space-y-6">

        {/* IMAGEN + INFO */}
        <div className="flex gap-6 items-start flex-col sm:flex-row">

          {/* Imagen */}
          {plugin.imagen_url ? (
            <img
              src={plugin.imagen_url}
              alt={plugin.nombre}
              className="w-40 h-40 object-cover rounded-lg shadow"
            />
          ) : (
            <div className="w-40 h-40 bg-gray-400 rounded-lg" />
          )}

          <div className="space-y-3 flex-1">

            {/* Descripción */}
            <p className="opacity-80">{plugin.descripcion}</p>

            {/* Descargas */}
            <p className="flex items-center gap-2 text-sm">
              <Download size={18} />
              <strong>{descargas}</strong> descargas
            </p>
          </div>
        </div>

        {/* PRECIOS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <CardPrice label="Estándar" value={plugin.precio} color="blue" />
          <CardPrice label="Anual" value={plugin.precio_anual} color="green" />
          <CardPrice label="Completa" value={plugin.precio_completa} color="purple" />
        </div>

        {/* ARCHIVO Y VIDEO */}
        <div className="space-y-3 border-t pt-4 dark:border-gray-700">

          <div>
            <strong>Archivo TSEP:</strong>
            {plugin.archivo_url ? (
              <a
                href={plugin.archivo_url}
                target="_blank"
                className="text-blue-600 dark:text-blue-400 flex items-center gap-1"
              >
                Descargar <ExternalLink size={14} />
              </a>
            ) : (
              <span className="opacity-60">No disponible</span>
            )}
          </div>

          <div>
            <strong>Video (YouTube):</strong>
            {plugin.video_url ? (
              <a
                href={plugin.video_url}
                target="_blank"
                className="text-blue-600 dark:text-blue-400 flex items-center gap-1"
              >
                Ver video <ExternalLink size={14} />
              </a>
            ) : (
              <span className="opacity-60">No disponible</span>
            )}
          </div>
        </div>

        {/* ACCIONES */}
        <div className="flex gap-4 justify-end pt-4 border-t dark:border-gray-700">

          <Link href={`/panel/admin/plugins/editar/${id}`}>
            <button className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black rounded-lg flex items-center gap-2 shadow">
              <Edit3 size={18} /> Editar
            </button>
          </Link>

          <Link href={`/panel/admin/plugins/borrar/${id}`}>
            <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2 shadow">
              <Trash2 size={18} /> Borrar
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}

/* ============================================
   COMPONENTE CARD DE PRECIO
=============================================== */
function CardPrice({ label, value, color }) {
  const colors = {
    blue: "text-blue-600 dark:text-blue-400",
    green: "text-green-600 dark:text-green-400",
    purple: "text-purple-600 dark:text-purple-400",
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 shadow-sm border dark:border-gray-700">
      <p className="font-semibold">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${colors[color]}`}>
        {value > 0 ? `${value} €` : "—"}
      </p>
    </div>
  );
}