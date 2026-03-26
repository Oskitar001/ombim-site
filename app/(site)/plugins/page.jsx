"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function PluginsPage() {
  const [plugins, setPlugins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        // Plugins
        const r1 = await fetch("/api/plugin", { cache: "no-store" });
        const d1 = await r1.json();
        setPlugins(Array.isArray(d1) ? d1 : []);

        // Usuario
        const r2 = await fetch("/api/auth/me");
        const d2 = await r2.json();
        setUser(d2.user ?? null);
      } catch {
        setPlugins([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p>Cargando plugins...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Plugins OMBIM</h2>

      {!plugins.length && <p>No hay plugins disponibles todavía.</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {plugins.map((p) => (
          <div
            key={p.id}
            className="p-4 bg-gray-200 dark:bg-gray-800 rounded-lg shadow"
          >
            {/* Imagen */}
            {p.imagen_url && (
              <img
                src={p.imagen_url}
                alt={p.nombre}
                className="w-full h-40 object-cover rounded mb-3"
              />
            )}

            <h4 className="text-xl font-bold mb-2">{p.nombre}</h4>

            {p.descripcion && (
              <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                {p.descripcion}
              </p>
            )}

            <p className="font-semibold mb-4">
              {p.precio > 0 ? `${p.precio} €` : "Gratis"}
            </p>

            {/* Descargar Trial */}
            {user ? (
              <a
                href={`/api/plugin/download?plugin_id=${p.id}`}
                className="bg-blue-600 text-white px-3 py-2 rounded text-sm font-semibold inline-block mb-2"
              >
                Descargar versión Trial
              </a>
            ) : (
              <Link
                href="/login"
                className="bg-gray-500 text-white px-3 py-2 rounded text-sm font-semibold inline-block mb-2"
              >
                Inicia sesión para descargar
              </Link>
            )}

            {/* Ver plugin */}
            <Link
              href={`/plugins/${p.id}`}
              className="text-blue-600 underline text-sm inline-block mt-2"
            >
              Más información →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
