"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DescargarBoton from "./DescargarBoton";

export default function PluginClient({ plugin, pluginId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setUser(d.user ?? null));
  }, []);

  return (
    <section className="max-w-4xl mx-auto py-20 px-6">
      <h1 className="text-4xl font-bold mb-6">{plugin.nombre}</h1>

      <p className="text-lg mb-6">{plugin.descripcion}</p>

      {plugin.precio > 0 ? (
        <p className="text-2xl font-bold text-blue-600 mb-6">
          {plugin.precio} €
        </p>
      ) : (
        <p className="text-2xl font-bold text-green-600 mb-6">Gratis</p>
      )}

      {/* VIDEO */}
      {plugin.video_url && (
        <div className="aspect-video mb-8">
          <iframe
            src={plugin.video_url}
            className="w-full h-full rounded-xl"
            allowFullScreen
          />
        </div>
      )}

      {/* ARCHIVO */}
      {plugin.archivo_url && (
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          Archivo disponible para descarga.
        </p>
      )}

      {/* ACCIONES */}
      {user ? (
        <>
          {/* Descarga si es gratis */}
          {plugin.precio === 0 && <DescargarBoton pluginId={pluginId} />}

          {/* Compra */}
          {plugin.precio > 0 && (
            <Link href={`/pago/${pluginId}`}>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                Comprar licencias
              </button>
            </Link>
          )}
        </>
      ) : (
        <Link href="/login">
          <p className="mt-6 underline text-blue-600">
            Inicia sesión para descargar o comprar
          </p>
        </Link>
      )}
    </section>
  );
}