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

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // ⭐ NECESARIO PARA GUARDAR LA COOKIE
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al iniciar sesión");
        setLoading(false);
        return;
      }

      // Redirigir al panel
      window.location.href = "/panel";
    } catch (err) {
      setError("Error inesperado. Inténtalo de nuevo.");
      setLoading(false);
    }
  }

  return (
    <div className="pt-32 px-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Iniciar sesión</h1>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            className="w-full border px-3 py-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1">Contraseña</label>
          <input
            type="password"
            className="w-full border px-3 py-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          {loading ? "Cargando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
