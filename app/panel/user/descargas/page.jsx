// app/panel/user/descargas/page.jsx
"use client";

import { useEffect, useState } from "react";
import { Download, Box } from "lucide-react";

export default function DescargasUserPage() {
  const [plugins, setPlugins] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/user/plugins", {
          credentials: "include",
        });

        const data = await res.json();
        setPlugins(data.plugins ?? []);
      } catch (err) {
        console.error("Error cargando descargas:", err);
        setPlugins([]);
      }
    }

    load();
  }, []);

  if (plugins === null) return <p>Cargando descargas...</p>;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <Download size={30} /> Descargas disponibles
      </h1>

      {plugins.length === 0 && (
        <p className="text-gray-500">
          No tienes plugins disponibles para descargar.
        </p>
      )}

      <div className="flex flex-col gap-4">
        {plugins.map((p) => (
          <div
            key={p.id}
            className="p-6 bg-gray-200 dark:bg-gray-800 rounded-lg shadow flex justify-between items-center"
          >
            <div className="flex items-center gap-3">
              <Box size={26} className="text-gray-700 dark:text-gray-300" />
              <div>
                <p className="font-semibold text-lg">{p.nombre}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Versión: {p.version ?? "1.0"}
                </p>
              </div>
            </div>

            <a
              href={`/api/plugin/download?plugin_id=${p.id}`}
              className="btn-primary flex items-center gap-2"
            >
              <Download size={18} /> Descargar
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}