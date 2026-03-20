"use client";

import { useEffect, useState } from "react";

export default function UserEditPage({ params }) {
  const { id } = params;
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/admin/usuario/${id}`);
      const data = await res.json();
      setUser(data);
    }
    load();
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();

    await fetch(`/api/admin/usuario/${id}`, {
      method: "PUT",
      body: JSON.stringify(user)
    });

    alert("Usuario actualizado");
  }

  if (!user) return <p>Cargando...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Editar usuario</h1>

      <form onSubmit={handleSubmit}>
        <input
          className="border p-2 mr-2"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />

        <button className="bg-green-600 text-white px-4 py-2 rounded" type="submit">
          Guardar
        </button>
      </form>
    </div>
  );
}
