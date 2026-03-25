// app/(site)/plugins/[id]/PluginClient.jsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Download } from "lucide-react";

export default function PluginClient({ plugin, pluginId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setUser(d.user ?? null));
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">{plugin.nombre}</h1>

      {/* FOTO PRINCIPAL */}
      <div className="h-80 bg-white dark:bg-gray-900 rounded shadow overflow-hidden flex items-center justify-center">
        <img
          src={plugin.imagen_url ?? "/plugin-placeholder.png"}
          alt={plugin.nombre}
          className="object-cover h-full w-full"
        />
      </div>

      <p className="opacity-80">{plugin.descripcion}</p>

      {plugin.video_url && (
        <div className="aspect-video w-full overflow-hidden rounded shadow">
          <iframe
            src={plugin.video_url}
            className="w-full h-full"
            allowFullScreen
          />
        </div>
      )}

      <div className="space-y-4">
        {/* PRECIO */}
        <div className="text-xl font-semibold">
          {plugin.precio > 0
            ? `${plugin.precio} €`
            : "Gratis"}
        </div>

        {/* BOTONES */}
        {user ? (
          <>
            <a
              href={`/api/plugin/download?plugin_id=${pluginId}`}
              className="bg-green-600 text-white inline-flex items-center gap-2 px-4 py-2 rounded hover:bg-green-700 transition"
            >
              <Download size={18} /> Descargar Trial
            </a>

            {plugin.precio > 0 && (
              <Link
                href={`/pago/${pluginId}`}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition inline-block"
              >
                Comprar licencias →
              </Link>
            )}
          </>
        ) : (
          <Link
            href="/login"
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 inline-block"
          >
            Iniciar sesión para descargar
          </Link>
        )}
      </div>
    </div>
  );
}