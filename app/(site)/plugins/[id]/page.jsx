"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";

export default function PluginPage({ params }) {
  const { id } = use(params); // Next.js 16: params es un Promise

  const [plugin, setPlugin] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        // Cargar plugin
        const r1 = await fetch(`/api/plugin/${id}`, { cache: "no-store" });
        const d1 = await r1.json();

        // Cargar usuario
        const r2 = await fetch("/api/auth/me");
        const d2 = await r2.json();

        setPlugin(d1?.error ? null : d1);
        setUser(d2.user ?? null);
      } catch (e) {
        console.error(e);
        setPlugin(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return <p className="mt-10">Cargando plugin...</p>;
  if (!plugin) return <p className="mt-10">Plugin no encontrado.</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">

      {/* Título */}
      <h1 className="text-3xl font-bold mb-4">{plugin.nombre}</h1>

      {/* Descripción */}
      <p className="text-gray-700 dark:text-gray-300 mb-6">
        {plugin.descripcion}
      </p>

      {/* Vídeo */}
      {plugin.video_url && (
        <div className="mb-10">
          <iframe
            width="100%"
            height="400"
            src={plugin.video_url}
            className="rounded-lg shadow"
          ></iframe>
        </div>
      )}

      {/* Precio */}
      <p className="text-2xl font-bold mb-6">
        {plugin.precio > 0 ? `${plugin.precio} €` : "Gratis"}
      </p>

      {/* Botones */}
      <div className="flex flex-col gap-4">

        {/* Descarga Trial */}
        {user ? (
          <a
            href={`/api/plugin/download?plugin_id=${plugin.id}`}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg text-center font-semibold shadow hover:bg-blue-700"
          >
            Descargar versión TRIAL
          </a>
        ) : (
          <Link
            href="/login"
            className="bg-gray-500 text-white px-6 py-3 rounded-lg text-center font-semibold shadow hover:bg-gray-600"
          >
            Inicia sesión para descargar
          </Link>
        )}

        {/* Comprar licencias */}
        {plugin.precio > 0 && (
          <Link
            href={`/pago/${plugin.id}`}
            className="bg-green-600 text-white px-6 py-3 rounded-lg text-center font-semibold shadow hover:bg-green-700"
          >
            Comprar licencias →
          </Link>
        )}
      </div>
    </div>
  );
}
