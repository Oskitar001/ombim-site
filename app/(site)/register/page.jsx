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
      body: JSON.stringify({ email, password, nombre }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Error al registrarse");
      return;
    }

    setOk(
      "Registro completado. Revisa tu email para confirmar tu cuenta."
    );
  }

  return (
    <div className="max-w-md mx-auto py-10 space-y-4">
      <h1 className="text-xl font-bold">Crear cuenta</h1>

      <form onSubmit={handleRegister} className="space-y-4">
        <input
          required
          placeholder="Nombre"
          onChange={(e) => setNombre(e.target.value)}
          className="border p-2 rounded w-full"
        />

        <input
          required
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded w-full"
        />

        <input
          required
          type="password"
          placeholder="Contraseña"
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded w-full"
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
          Registrarse
        </button>
      </form>

      {error && <p className="text-red-600">{error}</p>}
      {ok && <p className="text-green-600">{ok}</p>}
    </div>
  );
}