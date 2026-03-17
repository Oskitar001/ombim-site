"use client";
import { useEffect, useState } from "react";

export default function MisPlugins() {
  const [plugins, setPlugins] = useState([]);

  useEffect(() => {
    fetch("/api/usuario/plugins", { credentials: "include" })
      .then(res => res.json())
      .then(data => setPlugins(data));
  }, []);

  return (
    <div className="max-w-3xl mx-auto pt-32 px-6">
      <h1 className="text-3xl font-bold mb-6">Mis Plugins</h1>

      {plugins.length === 0 && (
        <p className="text-gray-600 dark:text-gray-300">
          Aún no has comprado ningún plugin.
        </p>
      )}

      {plugins.map(p => (
        <div
          key={p.plugin_id}
          className="p-4 mb-4 rounded-lg border bg-white dark:bg-[#1a1a1a]"
        >
          <h2 className="text-xl font-bold">{p.nombre}</h2>

          <p className="mt-1">
            <strong>Estado:</strong> {p.estado}
          </p>

          {p.clave && (
            <p className="mt-1">
              <strong>Clave:</strong>{" "}
              <span className="font-mono">{p.clave}</span>
            </p>
          )}

          <div className="mt-4 flex gap-3">
            <a
              href={`/plugins/${p.plugin_id}`}
              className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
            >
              Ver plugin
            </a>

            {p.clave && (
              <a
                href={p.archivo_url}
                download
                className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
              >
                Descargar plugin
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
