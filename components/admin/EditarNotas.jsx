"use client";

import { useState } from "react";

export default function EditarNotas({ id, notasIniciales, onUpdated }) {
  const [notas, setNotas] = useState(notasIniciales);
  const [loading, setLoading] = useState(false);

  async function guardar() {
    setLoading(true);

    const res = await fetch("/api/admin/licencias/notas", {
      method: "POST",
      body: JSON.stringify({ id, notas }),
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
      <h3 className="font-bold mb-2">Notas</h3>

      <textarea
        className="border p-2 w-full h-32"
        value={notas}
        onChange={(e) => setNotas(e.target.value)}
      />

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
        onClick={guardar}
        disabled={loading}
      >
        Guardar notas
      </button>
    </div>
  );
}
