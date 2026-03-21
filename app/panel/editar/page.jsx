// ======================================================
// app/panel/editar/page.jsx
// ======================================================
"use client";

import { useState, useEffect } from "react";

export default function EditarUsuarioPage() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [ok, setOk] = useState("");
  const [error, setError] = useState("");

  // ⭐ Cargar datos actuales del usuario
  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setNombre(data.user.nombre || "");
          setEmail(data.user.email || "");
        }
      })
      .catch(() => {});
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setOk("");
    setError("");

    const res = await fetch("/api/auth/update-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email })
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Error al actualizar usuario");
      return;
    }

    setOk("Datos actualizados correctamente");
    setTimeout(() => {
      window.location.href = "/panel";
    }, 1200);
  }

  return (
    <div className="pt-32 max-w-xl mx-auto px-6">
      <h1 className="text-3xl font-bold mb-6">Editar Usuario</h1>

      <form onSubmit={handleSave} className="flex flex-col gap-4 p-6 rounded-lg shadow border">
        <input
          type="text"
          placeholder="Nuevo nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="email"
          placeholder="Nuevo email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
        />

        <button className="bg-blue-600 text-white py-2 rounded">
          Guardar cambios
        </button>

        {/* ⭐ BOTÓN CANCELAR */}
        <button
          type="button"
          onClick={() => window.location.href = "/panel"}
          className="bg-gray-300 text-black py-2 rounded hover:bg-gray-400 transition"
        >
          Cancelar
        </button>

        {ok && <p className="text-green-600">{ok}</p>}
        {error && <p className="text-red-600">{error}</p>}
      </form>
    </div>
  );
}
