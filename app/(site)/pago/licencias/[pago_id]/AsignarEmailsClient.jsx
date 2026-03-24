"use client";

import { useState } from "react";

export default function AsignarEmailsClient({ pago }) {
  const [emails, setEmails] = useState(
    pago.licencias.map((l) => ({
      licencia_id: l.id,
      email_tekla: l.email_tekla ?? "",
    }))
  );

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  function actualizarEmail(i, valor) {
    setEmails((prev) =>
      prev.map((item, idx) =>
        idx === i ? { ...item, email_tekla: valor } : item
      )
    );
  }

  async function guardar() {
    setLoading(true);
    setMsg("");
    setError("");

    const res = await fetch("/api/pagos/guardar-emails", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        pago_id: pago.id,
        emails,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Error guardando emails");
      return;
    }

    setMsg("Emails guardados correctamente.");
  }

  return (
    <section className="max-w-3xl mx-auto py-10 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Asignar Emails Tekla</h1>

      {emails.map((item, i) => (
        <div key={item.licencia_id}>
          <label className="block font-semibold mb-1">
            Licencia {item.licencia_id}
          </label>
          <input
            className="border p-2 w-full rounded"
            value={item.email_tekla}
            onChange={(e) => actualizarEmail(i, e.target.value)}
          />
        </div>
      ))}

      {error && <p className="text-red-600">{error}</p>}
      {msg && <p className="text-green-600">{msg}</p>}

      <button
        onClick={guardar}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Guardando..." : "Guardar emails"}
      </button>
    </section>
  );
}