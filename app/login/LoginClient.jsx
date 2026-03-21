"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginClient() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    console.log("HANDLE LOGIN EJECUTADO");

    let res;
    try {
      res = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
    } catch (err) {
      setError("No se pudo conectar con el servidor");
      setLoading(false);
      return;
    }

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Error al iniciar sesión");
      setLoading(false);
      return;
    }

    // ⭐ Mostrar nombre si existe
    if (data.user?.user_metadata?.nombre || data.user?.user_metadata?.member) {
      const nombre =
        data.user.user_metadata.nombre ||
        data.user.user_metadata.member;

      console.log("Bienvenido", nombre);
    }

    // ⭐ Redirigir al panel
    window.location.href = "/panel";
  }

  return (
    <div className="pt-32 flex flex-col items-center px-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Iniciar sesión</h1>

      <form
        onSubmit={handleLogin}
        className="flex flex-col gap-4 w-full max-w-sm p-6 rounded-lg shadow border"
      >
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border p-2 rounded"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded"
          disabled={loading}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>

        {/* ⭐ Botón cancelar */}
        <button
          type="button"
          onClick={() => window.location.href = "/"}
          className="bg-gray-300 text-black py-2 rounded"
        >
          Cancelar
        </button>

        <Link
          href="/register"
          className="text-blue-600 text-center underline"
        >
          Crear cuenta nueva
        </Link>

        {error && (
          <p className="text-red-600 text-center">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}
