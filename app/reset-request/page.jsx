"use client";

import { useState } from "react";

export default function ResetRequestPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");

    const res = await fetch("/api/auth/reset-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    const data = await res.json();
    setMsg(data.message);
  }

  return (
    <div className="pt-32 flex flex-col items-center px-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Recuperar contraseña</h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-sm p-6 rounded-lg shadow border"
      >
        <input
          type="email"
          placeholder="Tu correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border p-2 rounded"
        />

        <button className="bg-blue-600 text-white py-2 rounded">
          Enviar enlace
        </button>

        {msg && <p className="text-center">{msg}</p>}
      </form>
    </div>
  );
}
