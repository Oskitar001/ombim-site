"use client";

import { useState } from "react";

export default function CrearLicenciaModal({ onClose, onCreated }) {
  const [email, setEmail] = useState("");
  const [plugin, setPlugin] = useState("");
  const [notas, setNotas] = useState("");
  const [loading, setLoading] = useState(false);

  async function crear() {
    setLoading(true);

    const res = await fetch("/api/admin/licencias/crear", {
      method: "POST",
      body: JSON.stringify({
        email_tekla: email,
        plugin_id: plugin,
        notas,
      }),
    });

    const data = await res.json();

    setLoading(false);

    if (data.error) {
      alert(data.error);
      return;
    }

    onCreated();
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow w-96">
        <h2 className="text-xl font-bold mb-4">Crear licencia</h2>

        <input
          className="border p-2 w-full mb-2"
          placeholder="Email Tekla"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="border p-2 w-full mb-2"
          placeholder="Plugin ID"
          value={plugin}
          onChange={(e) => setPlugin(e.target.value)}
        />

        <textarea
          className="border p-2 w-full mb-2"
          placeholder="Notas"
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button className="px-4 py-2" onClick={onClose}>
            Cancelar
          </button>

          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={crear}
            disabled={loading}
          >
            {loading ? "Creando..." : "Crear"}
          </button>
        </div>
      </div>
    </div>
  );
}
