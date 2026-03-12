"use client";

import { useState } from "react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function login() {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ password }),
    });

    const data = await res.json();

    if (data.ok) {
      window.location.href = "/admin";
    } else {
      setError("Contraseña incorrecta");
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow w-80">
        <h1 className="text-2xl font-bold mb-4 text-center">Admin Login</h1>

        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
        )}

        <input
          type="password"
          placeholder="Contraseña"
          className="border p-2 w-full mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="w-full bg-blue-600 text-white py-2 rounded"
          onClick={login}
        >
          Entrar
        </button>
      </div>
    </div>
  );
}
