"use client";

import { useState } from "react";

export default function LoginPage() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  async function login() {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ user, pass }),
    });

    const data = await res.json();

    if (!data.ok) {
      setError("Credenciales incorrectas");
      return;
    }

    window.location.href = "/admin/licencias";
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="p-8 bg-white shadow-lg rounded w-80">
        <h1 className="text-2xl font-bold mb-4 text-center">Acceso Admin</h1>

        {error && (
          <p className="text-red-600 text-sm mb-3 text-center">{error}</p>
        )}

        <input
          className="border p-2 w-full mb-3 rounded"
          placeholder="Usuario"
          value={user}
          onChange={(e) => setUser(e.target.value)}
        />

        <input
          type="password"
          className="border p-2 w-full mb-4 rounded"
          placeholder="Contraseña"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
        />

        <button
          onClick={login}
          className="bg-blue-600 text-white w-full py-2 rounded"
        >
          Entrar
        </button>
      </div>
    </div>
  );
}
