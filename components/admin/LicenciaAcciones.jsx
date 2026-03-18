"use client";

import { useState } from "react";

export default function LicenciaAcciones({ id, onUpdated }) {
  const [loading, setLoading] = useState(false);

  async function call(endpoint, body = {}) {
    setLoading(true);

    const res = await fetch(`/api/admin/licencias/${endpoint}`, {
      method: "POST",
      body: JSON.stringify({ id, ...body }),
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
    <div className="mt-6 flex flex-wrap gap-3">
      <button
        className="bg-red-600 text-white px-4 py-2 rounded"
        onClick={() => call("bloquear")}
        disabled={loading}
      >
        Bloquear
      </button>

      <button
        className="bg-yellow-600 text-white px-4 py-2 rounded"
        onClick={() => call("trial")}
        disabled={loading}
      >
        Activar Trial
      </button>

      <button
        className="bg-green-600 text-white px-4 py-2 rounded"
        onClick={() => call("ampliar")}
        disabled={loading}
      >
        Ampliar 30 días
      </button>

      <button
        className="bg-purple-600 text-white px-4 py-2 rounded"
        onClick={() => call("reset-activaciones")}
        disabled={loading}
      >
        Reset Activaciones
      </button>
    </div>
  );
}
