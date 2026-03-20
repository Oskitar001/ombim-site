"use client";

import { useState } from "react";

export default function RecibirClaves({ pluginId }) {
  const [mensaje, setMensaje] = useState(null);
  const [cargando, setCargando] = useState(false);

  const recibir = async () => {
    setCargando(true);
    setMensaje(null);

    try {
      const res = await fetch("/api/recibir-claves", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plugin_id: pluginId })
      });

      if (res.ok) {
        setMensaje("Las claves han sido enviadas a tu email.");
      } else {
        setMensaje("Error al generar las claves.");
      }
    } catch (err) {
      setMensaje("Error de conexión con el servidor.");
    }

    setCargando(false);
  };

  return (
    <div className="mt-4">
      <button
        onClick={recibir}
        disabled={cargando}
        className={`px-4 py-2 rounded text-white transition ${
          cargando
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {cargando ? "Procesando..." : "Recibir claves de activación"}
      </button>

      {mensaje && (
        <p className="mt-3 text-green-600 font-semibold">{mensaje}</p>
      )}
    </div>
  );
}
