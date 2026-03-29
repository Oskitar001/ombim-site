"use client";

import { useState, useEffect } from "react";

export default function PerfilUsuario() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        if (!d.user) return;
        setUser(d.user);
        setEmail(d.user.email);
        setName(d.user.user_metadata?.name ?? "");
      });
  }, []);

  async function guardar() {
    setMsg("");

    const r = await fetch("/api/user/update", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password: password || undefined,
        name,
      }),
    });

    const d = await r.json();

    if (!r.ok) {
      setMsg("Error: " + d.error);
      return;
    }

    setMsg("Datos actualizados");
  }

  if (!user) return <p>Cargando…</p>;

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-bold">Mi Perfil</h2>

      <div>
        <label>Email</label>
        <input className="border p-2 w-full dark:bg-gray-900"
          value={email}
          onChange={(e) => setEmail(e.target.value)} />
      </div>

      <div>
        <label>Nombre</label>
        <input className="border p-2 w-full dark:bg-gray-900"
          value={name}
          onChange={(e) => setName(e.target.value)} />
      </div>

      <div>
        <label>Nueva contraseña (opcional)</label>
        <input type="password"
          className="border p-2 w-full dark:bg-gray-900"
          value={password}
          onChange={(e) => setPassword(e.target.value)} />
      </div>

      {msg && <p className="text-green-600">{msg}</p>}

      <button
        onClick={guardar}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
        Guardar cambios
      </button>
    </div>
  );
}