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

    setOk("Registro completado. Revisa tu email para confirmar tu cuenta.");
  }

  return (
    <div className="pt-32 flex flex-col items-center px-6 bg-[#f3f4f6]Soft dark:bg-[#242424] min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-[#1f2937] dark:text-[#e6e6e6]">
        Crear cuenta
      </h1>

      <form
        onSubmit={handleRegister}
        className="flex flex-col gap-4 w-full max-w-sm bg-[#f3f4f6]Soft dark:bg-[#1a1a1a] p-6 rounded-lg shadow border border-[#d1d5db] dark:border-[#3a3a3a]"
      >
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          className="border border-[#d1d5db] dark:border-gray-600 bg-[#f3f4f6]Soft dark:bg-[#242424] text-[#1f2937] dark:text-[#e6e6e6] p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
        />

        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border border-[#d1d5db] dark:border-gray-600 bg-[#f3f4f6]Soft dark:bg-[#242424] text-[#1f2937] dark:text-[#e6e6e6] p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border border-[#d1d5db] dark:border-gray-600 bg-[#f3f4f6]Soft dark:bg-[#242424] text-[#1f2937] dark:text-[#e6e6e6] p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition active:scale-95"
        >
          Registrarse
        </button>

        <button
          type="button"
          onClick={() => window.location.href = "/"}
          className="bg-gray-300 dark:bg-gray-700 text-black dark:text-white py-2 rounded hover:bg-gray-400 dark:hover:bg-gray-600 transition active:scale-95"
        >
          Cancelar
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

      <p className="mt-4 text-[#1f2937] dark:text-[#e6e6e6]">
        ¿Ya tienes cuenta?{" "}
        <a href="/login" className="text-blue-600 dark:text-blue-400 hover:underline">
          Inicia sesión aquí
        </a>
      </p>
    </div>
  );
}
