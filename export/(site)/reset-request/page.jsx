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
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setMsg(data.message);
  }

  return (
    <div className="max-w-md mx-auto py-10">
      <h1 className="text-xl font-bold mb-4">Recuperar contraseña</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          required
          type="email"
          placeholder="Tu email"
          className="border p-2 rounded w-full"
          onChange={(e) => setEmail(e.target.value)}
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Enviar enlace
        </button>
      </form>

      {msg && <p className="mt-4">{msg}</p>}
    </div>
  );
}