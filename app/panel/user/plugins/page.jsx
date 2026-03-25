"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Box, Download, KeyRound } from "lucide-react";

export default function MisPluginsPage() {
  const [plugins, setPlugins] = useState([]);
  const [licencias, setLicencias] = useState([]);

  useEffect(() => {
    async function load() {
      const resP = await fetch("/api/user/plugins", { credentials: "include" });
      const dP = await resP.json();
      setPlugins(dP.plugins || []);

      const resL = await fetch("/api/user/licencias");
      const dL = await resL.json();
      setLicencias(dL.licencias || []);
    }
    load();
  }, []);

  // Agrupar licencias por plugin para mostrar info
  const licPorPlugin = licencias.reduce((acc, l) => {
    acc[l.plugin_id] = acc[l.plugin_id] ? acc[l.plugin_id] + 1 : 1;
    return acc;
  }, {});

  return (
    <div className="space-y-8 max-w-4xl mx-auto">

      <h1 className="text-3xl font-bold flex items-center gap-2">
        <Box size={30} /> Mis Plugins
      </h1>

      {plugins.length === 0 && (
        <p className="text-gray-500">Todavía no tienes plugins asociados.</p>
      )}

      <div className="flex flex-col gap-4">
        {plugins.map((p) => (
          <div
            key={p.id}
            className="p-6 rounded-lg bg-gray-200 dark:bg-gray-800 shadow flex justify-between items-center"
          >
            <div className="flex flex-col gap-1">
              <p className="text-xl font-semibold">{p.nombre}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Versión: {p.version}
              </p>

              <p className="text-sm flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <KeyRound size={16} /> {licPorPlugin[p.id] || 0} licencias
              </p>
            </div>

            <a
              className="btn-primary flex items-center gap-2"
              href={p.url_descarga}
              download
            >
              <Download size={18} /> Descargar
            </a>
          </div>
        ))}
      </div>

    </div>
  );
}