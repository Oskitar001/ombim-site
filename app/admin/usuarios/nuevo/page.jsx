// app/admin/usuarios/nuevo/page.jsx
"use client";
import { useState } from "react";

export default function NuevoUsuario() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [maxDispositivos, setMaxDispositivos] = useState(1);
  const [mensaje, setMensaje] = useState("");

  async function crearUsuario(e) {
    e.preventDefault();
    setMensaje("");

    const res = await fetch("/api/admin/users/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        max_dispositivos: maxDispositivos
      })
    });

    const data = await res.json();

    if (data.ok) {
      setMensaje("Usuario creado correctamente");
      setEmail("");
      setPassword("");
      setMaxDispositivos(1);
    } else {
      setMensaje("Error al crear usuario");
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">Crear nuevo usuario</h1>

      <form onSubmit={crearUsuario} className="space-y-4 max-w-md">
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded bg-white text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          className="w-full p-3 rounded bg-white text-black"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Máx. dispositivos"
          className="w-full p-3 rounded bg-white text-black"
          value={maxDispositivos}
          onChange={(e) => setMaxDispositivos(e.target.value)}
          min="1"
          required
        />

        <button
          type="submit"
          className="bg-white text-black py-3 px-6 rounded font-semibold hover:bg-neutral-200 transition"
        >
          Crear usuario
        </button>

        {mensaje && <p className="text-green-400 mt-3">{mensaje}</p>}
      </form>
    </div>
  );
}
