"use client";

import { useState } from "react";

export default function NuevaEmpresaPage() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [estado, setEstado] = useState("activa");
  const [error, setError] = useState("");

  async function crear() {
    setError("");

    const res = await fetch("/api/admin/empresas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email, password, estado }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error);
      return;
    }

    window.location.href = "/admin/empresas";
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-3xl font-bold mb-6">Nueva empresa</h1>

      {error && <p className="bg-red-100 text-red-700 p-3 mb-4">{error}</p>}

      <input
        className="w-full p-3 border rounded mb-4"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />

      <input
        className="w-full p-3 border rounded mb-4"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="w-full p-3 border rounded mb-4"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <select
        className="w-full p-3 border rounded mb-6"
        value={estado}
        onChange={(e) => setEstado(e.target.value)}
      >
        <option value="activa">Activa</option>
        <option value="suspendida">Suspendida</option>
      </select>

      <button
        onClick={crear}
        className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Crear empresa
      </button>
    </div>
  );
}
