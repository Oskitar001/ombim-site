// app/panel/user/descargas/page.jsx
"use client";

import { useEffect, useState } from "react";
import { Download, Box } from "lucide-react";

/* -----------------------------------------------------
   DESCARGAS USER — ESTILO PREMIUM
----------------------------------------------------- */

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

      {/* Título */}
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <Download size={30} /> Descargas disponibles
      </h1>

      {/* Contenedor premium */}
      <UserSection>
        {plugins.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400">
            No tienes plugins disponibles para descargar.
          </p>
        )}

        <div className="space-y-4">
          {plugins.map((p) => (
            <DownloadCard key={p.id} plugin={p} />
          ))}
        </div>
      </UserSection>

    </div>
  );
}

/* -----------------------------------------------------
   COMPONENTES PREMIUM
----------------------------------------------------- */

/* Contenedor premium reutilizable */
function UserSection({ children }) {
  return (
    <div
      className="
        bg-white dark:bg-gray-900 
        rounded-xl shadow 
        border border-gray-300 dark:border-gray-700
        p-6 space-y-4
      "
    >
      {children}
    </div>
  );
}

/* Tarjeta premium de descarga */
function DownloadCard({ plugin }) {
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
      {/* Información plugin */}
      <div className="flex items-center gap-4">
        <Box size={30} className="text-gray-700 dark:text-gray-300" />

        <div>
          <p className="font-semibold text-lg">{plugin.nombre}</p>

          <p className="text-sm text-gray-600 dark:text-gray-400">
            Versión: {plugin.version ?? "1.0"}
          </p>
        </div>
      </div>

      {/* Botón descarga */}
      <a
        href={`/api/plugin/download?plugin_id=${plugin.id}`}
        className="
          bg-blue-600 text-white 
          px-4 py-2 rounded-lg 
          flex items-center gap-2 
          hover:bg-blue-700
          shadow 
          transition
        "
      >
        <Download size={18} /> Descargar
      </a>
    </div>
  );
}