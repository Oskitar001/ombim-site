"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    let res;
    try {
      res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
    } catch (err) {
      setError("No se pudo conectar con el servidor");
      return;
    }

    // --- Protección contra JSON vacío ---
    let data = {};
    try {
      data = await res.json();
    } catch {
      data = {};
    }
    // -------------------------------------

    if (!res.ok) {
      setError(data.error || "Error al iniciar sesión");
      return;
    }

    // Si todo va bien, Supabase ya creó la cookie
    window.location.href = "/plugins";
  }

  return (
    <div className="pt-32 flex flex-col items-center px-6">
      <h1 className="text-3xl font-bold mb-6">Iniciar sesión</h1>

      <form
        onSubmit={handleLogin}
        className="flex flex-col gap-4 w-full max-w-sm bg-white p-6 rounded-lg shadow"
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
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Entrar
        </button>

        {error && <p className="text-red-600 text-center">{error}</p>}
      </form>

      <p className="mt-4">
        ¿No tienes cuenta?{" "}
        <a href="/login/register" className="text-blue-600 hover:underline">
          Regístrate aquí
        </a>
      </p>
    </div>
  );
}
