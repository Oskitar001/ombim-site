// ======================================================
// 2) PÁGINA DE EDICIÓN DE USUARIO
//    app/admin/users/[id]/page.jsx
// ======================================================
"use client";

import { useEffect, useState } from "react";

export default function EditUserPage({ params }) {
  const userId = params.id;

  const [user, setUser] = useState(null);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  const [ok, setOk] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/users/list")
      .then((res) => res.json())
      .then((data) => {
        const u = data.users.find((x) => x.id === userId);
        if (u) {
          setUser(u);
          setNombre(u.user_metadata?.nombre || "");
          setEmail(u.email);
          setRole(u.user_metadata?.role || "user");
        }
      });
  }, [userId]);

  async function handleSave(e) {
    e.preventDefault();
    setOk("");
    setError("");

    const res = await fetch("/api/admin/users/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, nombre, email, role }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Error al actualizar usuario");
      return;
    }

    setOk("Usuario actualizado correctamente");
  }

  if (!user) return <div className="p-10">Cargando usuario...</div>;

  return (
    <div className="p-10 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Editar Usuario</h1>

      <form onSubmit={handleSave} className="flex flex-col gap-4 p-6 rounded-lg shadow border">

        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="user">Usuario</option>
          <option value="admin">Administrador</option>
        </select>

        <button className="bg-blue-600 text-white py-2 rounded">
          Guardar cambios
        </button>

        {ok && <p className="text-green-600">{ok}</p>}
        {error && <p className="text-red-600">{error}</p>}
      </form>
    </div>
  );
}