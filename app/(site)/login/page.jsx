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

    const refresh = await fetch("/api/auth/me", { credentials: "include" });
    const me = await refresh.json();

    const role = me?.user?.user_metadata?.role ?? "user";

    window.location.href = role === "admin" ? "/panel/admin" : "/panel/user";
  }

  return (
    <div className="max-w-md mx-auto py-10">
      <h2 className="text-2xl font-bold mb-4">Iniciar sesión</h2>

      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          className="border p-2 rounded w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-red-600">{error}</p>}

        <button className="w-full bg-blue-600 text-white py-2 rounded">
          {loading ? "Cargando..." : "Entrar"}
        </button>
      </form>

      <p className="text-center mt-4 text-sm">
        ¿No tienes cuenta?{" "}
        <a href="/register" className="text-blue-600 underline">
          Regístrate aquí
        </a>
      </p>
    </div>
  );
}