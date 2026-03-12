"use client";

import { useState } from "react";

export default function CrearUsuario() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dias, setDias] = useState(30);
  const [maxDisp, setMaxDisp] = useState(3);
  const [mensaje, setMensaje] = useState("");

  async function crear(e) {
    e.preventDefault();

    const res = await fetch("/api/admin/usuarios/crear", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, dias, maxDisp }),
    });

    const data = await res.json();
    setMensaje(data.msg);
  }

  return (
    <div className="p-10 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Crear Usuario</h1>

      <form onSubmit={crear} className="space-y-4 bg-white p-6 shadow rounded">

        <div>
          <label className="block mb-1 font-semibold">Email</label>
          <input
            type="email"
            className="w-full border p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Contraseña</label>
          <input
            type="password"
            className="w-full border p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Días de licencia</label>
          <input
            type="number"
            className="w-full border p-2 rounded"
            value={dias}
            onChange={(e) => setDias(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Máx. dispositivos</label>
          <input
            type="number"
            className="w-full border p-2 rounded"
            value={maxDisp}
            onChange={(e) => setMaxDisp(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Crear usuario
        </button>
      </form>

      {mensaje && (
        <p className="mt-4 p-3 bg-green-100 text-green-700 rounded">
          {mensaje}
        </p>
      )}
    </div>
  );
}
