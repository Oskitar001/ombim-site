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
  }

  return (
    <div className="pt-32 flex flex-col items-center px-6">
      <h1 className="text-3xl font-bold mb-6">Crear cuenta</h1>

      <form
        onSubmit={handleRegister}
        className="flex flex-col gap-4 w-full max-w-sm bg-white p-6 rounded-lg shadow"
      >
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          className="border p-2 rounded"
        />

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
          Registrarse
        </button>

        {error && <p className="text-red-600 text-center">{error}</p>}
        {ok && <p className="text-green-600 text-center">{ok}</p>}
      </form>

      <p className="mt-4">
        ¿Ya tienes cuenta?{" "}
        <a href="/login" className="text-blue-600 hover:underline">
          Inicia sesión aquí
        </a>
      </p>
    </div>
  );
}
