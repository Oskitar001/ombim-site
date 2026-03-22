"use client";

import { useEffect, useState } from "react";
import DescargarBoton from "./DescargarBoton";
import RecibirClaves from "./RecibirClaves";

function toEmbed(url) {
  if (!url) return null;

  if (url.includes("youtu.be/")) {
    return "https://www.youtube.com/embed/" + url.split("youtu.be/")[1];
  }

  if (url.includes("watch?v=")) {
    return "https://www.youtube.com/embed/" + url.split("watch?v=")[1].split("&")[0];
  }

  return url;
}

export default function PluginClient({ plugin, pluginId }) {
  const [user, setUser] = useState(null);
  const [pago, setPago] = useState(null);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then(res => res.json())
      .then(data => setUser(data.user || null));

    // ⭐ API CORRECTA: /api/plugin/[id]
    fetch(`/api/plugin/${pluginId}`, { credentials: "include" })
      .then(res => (res.ok ? res.json() : null))
      .then(data => setPago(data));
  }, [pluginId]);

  const esDePago = plugin.precio > 0;

  return (
    <div className="max-w-4xl mx-auto pt-32 px-6">

      <h1 className="text-3xl font-bold mb-2">{plugin.nombre}</h1>

      {esDePago ? (
        <p className="text-lg font-semibold mb-4">{plugin.precio} €</p>
      ) : (
        <p className="text-lg font-semibold mb-4 text-green-600">Gratis</p>
      )}

      <p className="mb-6">{plugin.descripcion}</p>

      {plugin.video_url && (
        <iframe
          className="w-full h-64 mb-6 rounded-lg shadow bg-black"
          src={toEmbed(plugin.video_url)}
          title={plugin.nombre}
          allowFullScreen
        ></iframe>
      )}

      {!user && (
        <div className="mt-6 p-4 bg-yellow-100 border border-yellow-300 rounded">
          <p className="text-yellow-800 font-semibold mb-3">
            Debes iniciar sesión para descargar este plugin o realizar la compra.
          </p>

          <a
            href="/login"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Iniciar sesión
          </a>
        </div>
      )}

      {user && (
        <>
          <DescargarBoton pluginId={pluginId} user={user} />

          {esDePago && (
            <div className="mt-6 space-y-4">

              {!pago?.pago && (
                <a
                  href={`/pago/${pluginId}`}
                  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
                >
                  Ir al pago
                </a>
              )}

              {pago?.pago?.estado === "pendiente" && (
                <p className="text-yellow-600 font-semibold">
                  Pago pendiente de confirmación.
                </p>
              )}

              {pago?.pago?.estado === "confirmado" && !pago?.pago?.clave && (
                <RecibirClaves pluginId={pluginId} />
              )}

              {pago?.pago?.clave && (
                <div className="bg-green-100 p-4 rounded mt-4">
                  <p className="font-semibold">Ya tienes tu clave:</p>
                  <p className="text-lg font-mono mt-1">{pago.pago.clave}</p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
