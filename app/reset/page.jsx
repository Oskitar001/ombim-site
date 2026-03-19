"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ResetPage() {
  const params = useSearchParams();
  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");

    const res = await fetch("/api/auth/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password })
    });

    const data = await res.json();
    setMsg(data.message || data.error);

    if (res.ok) {
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    }
  }

  return (
    <div className="pt-32 flex flex-col items-center px-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Nueva contraseña</h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-sm p-6 rounded-lg shadow border"
      >
        <input
          type="password"
          placeholder="Nueva contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border p-2 rounded"
        />

        <button className="bg-blue-600 text-white py-2 rounded">
          Guardar contraseña
        </button>

        {msg && <p className="text-center">{msg}</p>}
      </form>
    </div>
  );
}
