"use client";

import { useState } from "react";

export default function AsignarEmailsClient({ pago, onSaved }) {
  // ⭐ Proteger si pago.licencias NO existe
  const initial = Array.isArray(pago.licencias)
    ? pago.licencias.map((l) => ({
        licencia_id: l.id,
        email_tekla: l.email_tekla ?? "",
      }))
    : [];

  const [emails, setEmails] = useState(initial);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  function actualizarEmail(i, valor) {
    setEmails((prev) =>
      prev.map((item, idx) =>
        idx === i ? { ...item, email_tekla: valor.trim() } : item
      )
    );
  }

  async function guardar() {
    setLoading(true);
    setMsg("");
    setError("");

    // ⭐ Validación local
    const vacios = emails.some((e) => !e.email_tekla || e.email_tekla === "");
    if (vacios) {
      setError("Todos los emails Tekla son obligatorios.");
      setLoading(false);
      return;
    }

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

    setMsg("Emails confirmados correctamente.");

    if (onSaved) onSaved();
  }

  return (
    <div className="space-y-4">
      {emails.map((item, i) => (
        <div key={i}>
          <label className="font-semibold">Email Tekla #{i + 1}</label>
          <input
            className="w-full p-2 rounded border dark:bg-gray-900"
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
        className="w-full bg-blue-600 text-white py-2 rounded mt-2 hover:bg-blue-800"
      >
        {loading ? "Guardando..." : "Confirmar emails"}
      </button>
    </div>
  );
}