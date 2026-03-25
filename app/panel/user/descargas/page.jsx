"use client";

import Link from "next/link";
import { Download, Box } from "lucide-react";
import { useEffect, useState } from "react";

export default function DescargasPage() {
  const [plugins, setPlugins] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/user/plugins", { credentials: "include" });
      const data = await res.json();
      setPlugins(data.plugins || []);
    }
    load();
  }, []);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">

      <h1 className="text-3xl font-bold flex items-center gap-2">
        <Download size={28} /> Descargas disponibles
      </h1>

      <p className="text-gray-600 dark:text-gray-300">
        Puedes descargar tus plugins siempre que estés logueado.
      </p>

      <div className="flex flex-col gap-4">
        {plugins.map((p) => (
          <div
            key={p.id}
            className="flex justify-between items-center p-4 bg-gray-200 dark:bg-gray-800 rounded shadow-sm"
          >
            <div className="flex items-center gap-3">
              <Box size={24} className="text-gray-600 dark:text-gray-300" />
              <div>
                <p className="font-semibold">{p.nombre}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Versión: {p.version}
                </p>
              </div>
            </div>

            <a
              href={p.url_descarga}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
              download
            >
              Descargar
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}