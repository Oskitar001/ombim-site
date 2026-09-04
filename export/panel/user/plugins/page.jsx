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

/* Contenedor premium */
function UserSection({ children }) {
  return (
    <section
      className="
        bg-white dark:bg-gray-900 
        border border-gray-300 dark:border-gray-700
        rounded-xl shadow p-6 space-y-4
      "
    >
      {children}
    </section>
  );
}

/* Tarjeta premium plugin */
function PluginCard({ plugin, licCount }) {
  return (
    <div
      className="
        p-6 
        bg-gray-100 dark:bg-gray-800 
        border border-gray-300 dark:border-gray-700
        rounded-xl shadow 
        flex justify-between items-center
      "
    >
      {/* Info del plugin */}
      <div className="flex flex-col gap-1">
        <p className="font-semibold text-lg">{plugin.nombre}</p>

        <p className="text-sm text-gray-700 dark:text-gray-400">
          Versión: {plugin.version ?? "—"}
        </p>

        <p className="text-sm flex items-center gap-1 text-gray-700 dark:text-gray-400">
          <KeyRound size={14} /> {licCount} licencias asociadas
        </p>
      </div>

      {/* Botón descargar */}
      <Tooltip label="Descargar plugin">
        <a
          href={plugin.url_descarga}
          className="
            flex items-center gap-2 
            bg-blue-600 hover:bg-blue-700 
            text-white px-4 py-2 rounded-lg shadow
          "
        >
          <Download size={18} />
          Descargar
        </a>
      </Tooltip>
    </div>
  );
}

export default function UserPluginsPage() {
  const [plugins, setPlugins] = useState(null);
  const [licencias, setLicencias] = useState([]);

  useEffect(() => {
    async function load() {
      // Obtener plugins disponibles
      const rP = await fetch("/api/user/plugins", { credentials: "include" });
      const dP = await rP.json();
      setPlugins(dP.plugins || []);

      // Obtener licencias del usuario
      const rL = await fetch("/api/user/licencias");
      const dL = await rL.json();
      setLicencias(dL.licencias || []);
    }

    load();
  }, []);

  if (plugins === null)
    return <p className="p-4">Cargando plugins...</p>;

  // Licencias por plugin_id
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

      <UserSection>
        {/* Si no hay plugins */}
        {plugins.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400">
            Aún no tienes plugins asociados.
          </p>
        )}

        {/* Tarjetas premium */}
        <div className="flex flex-col gap-4">
          {plugins.map((p) => (
            <PluginCard
              key={p.id}
              plugin={p}
              licCount={licPorPlugin[p.id] || 0}
            />
          ))}
        </div>
      </UserSection>

    </div>
  );
}
