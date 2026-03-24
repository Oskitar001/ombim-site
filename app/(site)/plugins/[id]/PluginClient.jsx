"use client";

import { useEffect, useState } from "react";
import DescargarBoton from "./DescargarBoton";

export default function PluginClient({ plugin, pluginId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setUser(d.user || null));
  }, []);

  return (
    <div className="max-w-4xl mx-auto pt-32 px-6">
      <h1 className="text-3xl font-bold mb-2">{plugin.nombre}</h1>
      <p className="mb-4">{plugin.descripcion}</p>

      {plugin.precio > 0 ? (
        <p className="text-lg font-semibold mb-4">{plugin.precio} €</p>
      ) : (
        <p className="text-lg font-semibold mb-4 text-green-600">Gratis</p>
      )}

      {/* ⭐ VIDEO DEL PLUGIN */}
      {plugin.video_url && (
        <div
          className="relative w-full mt-6"
          style={{ paddingBottom: "56.25%" }}
        >
          <iframe
            src={plugin.video_url}
            title="Video del plugin"
            allowFullScreen
            className="absolute top-0 left-0 w-full h-full rounded border"
          />
        </div>
      )}

      {/* ⭐ ARCHIVO / IMAGEN */}
      {plugin.archivo_url && (
        <img
          src={plugin.archivo_url}
          alt={plugin.nombre}
          className="w-full rounded border mt-6"
        />
      )}

      {/* ⭐ BOTONES */}
      {user ? (
        <>
          <DescargarBoton pluginId={pluginId} />

          {plugin.precio > 0 && (
            <a
              href={`/pago/${pluginId}`}
              className="inline-block mt-4 bg-purple-600 text-white px-4 py-2 rounded"
            >
              Comprar licencias
            </a>
          )}
        </>
      ) : (
        <a
          href="/login"
          className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Inicia sesión para descargar o comprar
        </a>
      )}
    </div>
  );
}
