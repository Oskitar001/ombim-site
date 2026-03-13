"use client";

import { useEffect, useState } from "react";

export default function EditarUsuario() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const [id, setId] = useState(null);

  // Obtener ID desde la URL (solo en cliente)
  useEffect(() => {
    const userId = new URLSearchParams(window.location.search).get("id");
    setId(userId);
  }, []);

  async function cargar() {
    if (!id) return;

    const res = await fetch(`/api/admin/users/get?id=${id}`);
    const data = await res.json();
    setUsuario(data.usuario);
    setLoading(false);
  }

  async function guardar(e) {
    e.preventDefault();
    setMensaje("");

    const res = await fetch("/api/admin/users/edit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuario)
    });

    const data = await res.json();

    if (data.ok) {
      setMensaje("Usuario actualizado correctamente");
    } else {
      setMensaje("Error al actualizar usuario");
    }
  }

  // Cargar usuario cuando tengamos el ID
  useEffect(() => {
    cargar();
  }, [id]);

  if (loading || !usuario) {
    return <p className="text-neutral-400">Cargando usuario...</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">Editar usuario</h1>

      <form onSubmit={guardar} className="space-y-4 max-w-md">
        <input
          type="email"
          className="w-full p-3 rounded bg-neutral-800 text-white"
          value={usuario.email}
          onChange={(e) => setUsuario({ ...usuario, email: e.target.value })}
        />

        <input
          type="number"
          className="w-full p-3 rounded bg-neutral-800 text-white"
          value={usuario.max_dispositivos}
          onChange={(e) =>
            setUsuario({ ...usuario, max_dispositivos: e.target.value })
          }
        />

        <select
          className="w-full p-3 rounded bg-neutral-800 text-white"
          value={usuario.estado}
          onChange={(e) => setUsuario({ ...usuario, estado: e.target.value })}
        >
          <option value="activo">Activo</option>
          <option value="suspendido">Suspendido</option>
        </select>

        <input
          type="password"
          placeholder="Nueva contraseña (opcional)"
          className="w-full p-3 rounded bg-neutral-800 text-white"
          onChange={(e) =>
            setUsuario({ ...usuario, nueva_password: e.target.value })
          }
        />

        <button
          type="submit"
          className="bg-white text-black py-3 px-6 rounded font-semibold hover:bg-neutral-200 transition"
        >
          Guardar cambios
        </button>

        {mensaje && <p className="text-green-400 mt-3">{mensaje}</p>}
      </form>
    </div>
  );
}
