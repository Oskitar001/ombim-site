"use client";
import { useState, useEffect } from "react";

export default function PagoClient({ id }) {
  const [plugin, setPlugin] = useState(null);
  const [enviado, setEnviado] = useState(false);

  useEffect(() => {
    fetch(`/api/plugin/${id}`)
      .then(res => res.json())
      .then(data => setPlugin(data));
  }, [id]);

  if (!plugin) return <div className="pt-32 text-center">Cargando...</div>;

  const enviarConfirmacion = async () => {
    const res = await fetch("/api/transferencia", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plugin_id: id })
    });

    if (res.ok) setEnviado(true);
  };

  return (
    <div className="max-w-2xl mx-auto pt-32 px-6">
      <h1 className="text-3xl font-bold mb-4">
        Pago por transferencia — {plugin.nombre}
      </h1>

      <div className="bg-gray-100 dark:bg-[#222] p-4 rounded-lg mb-6">
        <p><strong>Precio:</strong> {plugin.precio} €</p>
        <p><strong>IBAN:</strong> ES60 0049 2851 4027 1413 5754</p>
        <p><strong>Titular:</strong> Oscar Martínez</p>
        <p><strong>Concepto:</strong> Plugin {plugin.nombre} — ID {id}</p>
      </div>

      {!enviado ? (
        <button
          onClick={enviarConfirmacion}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          He realizado la transferencia
        </button>
      ) : (
        <p className="text-green-600 font-semibold">
          ¡Perfecto! Hemos recibido tu aviso.  
          Óscar verificará el pago y te enviará las claves de activación.
        </p>
      )}
    </div>
  );
}
