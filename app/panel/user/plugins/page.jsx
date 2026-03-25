"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Box, Download, KeyRound } from "lucide-react";

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
          pointer-events-none whitespace-nowrap
        "
      >
        {label}
      </div>
    </div>
  );
}

export default function UserPluginsPage() {
  const [plugins, setPlugins] = useState(null);
  const [licencias, setLicencias] = useState([]);

  useEffect(() => {
    async function load() {
      /* Obtener plugins disponibles */
      const rP = await fetch("/api/user/plugins", { credentials: "include" });
      const dP = await rP.json();
      setPlugins(dP.plugins || []);

      /* Obtener licencias para contar cuántas tiene de cada plugin */
      const rL = await fetch("/api/user/licencias");
      const dL = await rL.json();
      setLicencias(dL.licencias || []);
    }

    load();
  }, []);

  if (plugins === null) return <p>Cargando plugins...</p>;

  /* Licencias por plugin_id */
  const licPorPlugin = licencias.reduce((acc, l) => {
    acc[l.plugin_id] = (acc[l.plugin_id] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-8 max-w-4xl mx-auto">

      {/* Título */}
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <Box size={30} /> Mis Plugins
      </h1>

      {/* Si no hay plugins */}
      {plugins.length === 0 && (
        <p className="text-gray-500">Aún no tienes plugins asociados.</p>
      )}

      {/* Tarjetas */}
      <div className="flex flex-col gap-4">
        {plugins.map((p) => (
          <div
            key={p.id}
            className="p-6 bg-gray-200 dark:bg-gray-800 rounded-lg shadow flex justify-between items-center"
          >
            {/* Info del plugin */}
            <div className="flex flex-col gap-1">
              <p className="font-semibold text-lg">{p.nombre}</p>
              <p className="text-sm text-gray-700 dark:text-gray-400">
                Versión: {p.version}
              </p>

              <p className="text-sm flex items-center gap-1 text-gray-700 dark:text-gray-400">
                <KeyRound size={14} /> {licPorPlugin[p.id] || 0} licencias asociadas
              </p>
            </div>

            {/* Botón descargar */}
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