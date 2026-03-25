"use client";

import { useEffect, useState } from "react";
import { Box, Download } from "lucide-react";

/* Tooltip PRO */
function Tooltip({ label, children }) {
  return (
    <div className="relative group flex items-center">
      {children}

      <div
        className="
          absolute left-1/2 -translate-x-1/2 bottom-full mb-2
          opacity-0 group-hover:opacity-100 transition
          bg-black text-white text-xs py-1 px-2 rounded shadow
          whitespace-nowrap pointer-events-none
        "
      >
        {label}
      </div>
    </div>
  );
}

export default function DescargasUserPage() {
  const [plugins, setPlugins] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/user/plugins", {
          credentials: "include",
        });

        const data = await res.json();
        setPlugins(data.plugins || []);
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

      {/* Título */}
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <Download size={30} /> Descargas disponibles
      </h1>

      {/* Si no hay plugins */}
      {plugins.length === 0 && (
        <p className="text-gray-500">No tienes plugins disponibles para descargar.</p>
      )}

      {/* Lista de plugins */}
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
                  Versión: {p.version}
                </p>
              </div>
            </div>

            {/* Botón de descarga con tooltip */}
            <Tooltip label="Descargar plugin">
              <a
                href={p.url_descarga}
                download
                className="btn-primary flex items-center gap-2"
              >
                <Download size={18} /> Descargar
              </a>
            </Tooltip>
          </div>
        ))}
      </div>

    </div>
  );
}