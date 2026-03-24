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
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Error al iniciar sesión");
      return;
    }

    const role = data.user?.user_metadata?.role;

    window.location.href =
      role === "admin" ? "/panel/admin" : "/panel/user";
  }

  return (
    <div className="max-w-md mx-auto py-10">
      <h1 className="text-xl font-bold mb-6">Iniciar sesión</h1>

      <form onSubmit={handleLogin} className="space-y-4">
        <input
          required
          type="email"
          placeholder="Email"
          className="border p-2 w-full rounded"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          required
          type="password"
          placeholder="Contraseña"
          className="border p-2 w-full rounded"
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-600">{error}</p>}

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          disabled={loading}
        >
          {loading ? "Cargando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}