"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  async function handleRegister(e) {
    e.preventDefault();
    setError("");
    setOk("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, nombre })
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Error al registrarse");
      return;
    }

    setOk("Registro completado. Ahora puedes iniciar sesión.");
    setTimeout(() => {
      window.location.href = "/login";
    }, 1200);

  }

  return (
    <div className="pt-32 flex flex-col items-center px-6 bg-white dark:bg-[#111] min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Crear cuenta
      </h1>

      <form
        onSubmit={handleRegister}
        className="flex flex-col gap-4 w-full max-w-sm bg-white dark:bg-[#1a1a1a] p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700"
      >
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#111] text-gray-900 dark:text-gray-100 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
        />

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
          Registrarse
        </button>

        {error && (
          <p className="text-red-600 dark:text-red-400 text-center">
            {error}
          </p>
        )}

        {ok && (
          <p className="text-green-600 dark:text-green-400 text-center">
            {ok}
          </p>
        )}
      </form>

      <p className="mt-4 text-gray-700 dark:text-gray-300">
        ¿Ya tienes cuenta?{" "}
        <a href="/login" className="text-blue-600 dark:text-blue-400 hover:underline">
          Inicia sesión aquí
        </a>
      </p>
    </div>
  );
}
