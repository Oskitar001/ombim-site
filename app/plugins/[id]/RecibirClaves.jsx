"use client";
import { useState } from "react";

export default function RecibirClaves({ pluginId }) {
  const [mensaje, setMensaje] = useState(null);

  const recibir = async () => {
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
  };

  return (
    <div>
      <button
        onClick={recibir}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
      >
        Recibir claves de activación
      </button>

      {mensaje && (
        <p className="mt-3 text-green-600 font-semibold">{mensaje}</p>
      )}
    </div>
  );
}
