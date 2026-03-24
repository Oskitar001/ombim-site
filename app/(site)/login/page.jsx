// app/(site)/login/page.jsx
"use client";

import { useState } from "react";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Error al iniciar sesión");
      return;
    }

    // 🔥 REFRESCAMOS USUARIO PARA LEER METADATA REAL
    const refresh = await fetch("/api/auth/me", { credentials: "include" });
    const me = await refresh.json();

    const role = me?.user?.user_metadata?.role ?? "user";

    // 🔥 REDIRECCIÓN PERFECTA
    if (role === "admin") {
      window.location.href = "/panel/admin";
      return;
    }

    window.location.href = "/panel/user";
  }

  return (
    <div className="max-w-md mx-auto mt-24 p-6 bg-white dark:bg-[#1f1f1f] rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Iniciar sesión</h1>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label>Email</label>
          <input
            type="email"
            className="border p-2 rounded w-full dark:bg-[#333]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Contraseña</label>
          <input
            type="password"
            className="border p-2 rounded w-full dark:bg-[#333]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded mt-2"
        >
          {loading ? "Cargando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}