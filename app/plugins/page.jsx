"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function PluginsPublicPage() {
  const [plugins, setPlugins] = useState([]);
  const [empresa, setEmpresa] = useState(null);
  const [licencias, setLicencias] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        // Usuario logueado
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setEmpresa(user);

          const resLic = await fetch(`/api/licencias/byEmpresa?id=${user.id}`);
          const dataLic = await resLic.json();
          setLicencias(dataLic);
        }

        // Plugins desde tu API real
        const resPlugins = await fetch("/api/plugin");
        const dataPlugins = await resPlugins.json();

        console.log("📌 Plugins recibidos:", dataPlugins);

        setPlugins(dataPlugins);
      } catch (err) {
        console.error("Error cargando plugins:", err);
      }
    }

    loadData();
  }, []);

  const tieneLicencia = (pluginId) =>
    licencias.some((l) => l.plugin_id === pluginId && l.activa);

  return (
    <div className="p-10 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Plugins disponibles</h1>

      {plugins.length === 0 && (
        <p className="text-gray-600">No hay plugins disponibles.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {plugins.map((plugin) => (
          <div
            key={plugin.id}
            className="bg-white shadow rounded p-6 flex flex-col"
          >
            {plugin.imagen_url && (
              <img
                src={plugin.imagen_url}
                className="w-full h-48 object-cover rounded mb-4"
              />
            )}

            <h2 className="text-2xl font-bold">{plugin.nombre}</h2>

            <p className="text-gray-600 mt-2">{plugin.descripcion}</p>

            <div className="mt-auto pt-4 flex flex-col gap-3">
              <Link
                href={`/empresa/plugins/${plugin.id}`}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded text-center"
              >
                Ver más detalles
              </Link>

              {plugin.demo_url && (
                <a
                  href={plugin.demo_url}
                  download
                  className="bg-gray-800 text-white px-4 py-2 rounded text-center"
                >
                  Descargar demo
                </a>
              )}

              {!empresa && (
                <p className="text-sm text-gray-500">
                  Inicia sesión para comprar o descargar la versión completa.
                </p>
              )}

              {empresa && !tieneLicencia(plugin.id) && (
                <a
                  href={`/api/stripe/checkout?plugin_id=${plugin.id}&empresa_id=${empresa.id}`}
                  className="bg-green-600 text-white px-4 py-2 rounded text-center"
                >
                  Comprar por {plugin.precio}€
                </a>
              )}

              {empresa && tieneLicencia(plugin.id) && (
                <a
                  href={`/api/plugins/download?plugin_id=${plugin.id}&empresa_id=${empresa.id}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded text-center"
                >
                  Descargar versión completa
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
