"use client";

import { useState } from "react";

export default function OlvidarPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  async function enviar() {
    setMsg("");

    const r = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const d = await r.json();

    if (!r.ok) {
      setMsg("Error: " + d.error);
      return;
    }

    setMsg("Email enviado. Revisa tu bandeja.");
  }

  return (
    <div className="space-y-6 p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold">Restablecer contraseña</h2>

      <label>Introduce tu email</label>
      <input className="border p-2 w-full dark:bg-gray-900"
        value={email}
        onChange={(e) => setEmail(e.target.value)} />

      {msg && <p className="text-green-600">{msg}</p>}

      <button
        onClick={enviar}
        className="bg-blue-600 text-white px-4 py-2 rounded">
        Enviar enlace
      </button>
    </div>
  );
}