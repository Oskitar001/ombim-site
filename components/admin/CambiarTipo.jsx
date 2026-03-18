"use client";

import { useState } from "react";

export default function CambiarTipo({ id, tipos, tipoActual, onUpdated }) {
  const [tipo, setTipo] = useState(tipoActual);
  const [loading, setLoading] = useState(false);

  async function guardar() {
    setLoading(true);

    const res = await fetch("/api/admin/licencias/tipo", {
      method: "POST",
      body: JSON.stringify({ id, tipo_id: tipo }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.error) {
      alert(data.error);
      return;
    }

    onUpdated();
  }

  return (
    <div className="mt-6">
      <h3 className="font-bold mb-2">Tipo de licencia</h3>

      <select
        className="border p-2 w-full"
        value={tipo}
        onChange={(e) => setTipo(e.target.value)}
      >
        {tipos.map((t) => (
          <option key={t.id} value={t.id}>
            {t.nombre}
          </option>
        ))}
      </select>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
        onClick={guardar}
        disabled={loading}
      >
        Guardar tipo
      </button>
    </div>
  );
}
