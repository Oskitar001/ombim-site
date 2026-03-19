"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useSearchParams } from "next/navigation";


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const params = useSearchParams();
  const verified = params.get("verified");

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

    let data = {};
    try {
      data = await res.json();
    } catch {
      data = {};
    }

    if (!res.ok) {
      setError(data.error || "Error al iniciar sesión");
      return;
    }

    window.location.href = "/plugins";
  }

  return (
    <div className="pt-32 flex flex-col items-center px-6 bg-white dark:bg-[#111] min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Iniciar sesión
      </h1>

      {verified && (
  <div className="w-full max-w-sm mb-4 p-4 rounded-lg bg-green-100 dark:bg-green-900/30 border border-green-600 flex items-center gap-3 shadow">
    <span className="text-green-700 dark:text-green-300 text-xl">✔</span>
    <p className="text-green-700 dark:text-green-300">
      <strong>Email verificado.</strong> Ya puedes iniciar sesión.
    </p>
  </div>
)}


      <form
        onSubmit={handleLogin}
        className="flex flex-col gap-4 w-full max-w-sm bg-white dark:bg-[#1a1a1a] p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700"
      >
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#111] text-gray-900 dark:text-gray-100 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#111] text-gray-900 dark:text-gray-100 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition active:scale-95"
        >
          Entrar
        </button>

        {error && (
          <p className="text-red-600 dark:text-red-400 text-center">
            {error}
          </p>
        )}
      </form>

      <p className="mt-4 text-gray-700 dark:text-gray-300">
        ¿No tienes cuenta?{" "}
        <a href="/register" className="text-blue-600 dark:text-blue-400 hover:underline">
          Regístrate aquí
        </a>
      </p>
    </div>
  );
}

