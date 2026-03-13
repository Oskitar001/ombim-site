// app/admin/usuarios/page.jsx
"use client";
import { useEffect, useState } from "react";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");

  async function cargarUsuarios() {
    const res = await fetch(`/api/admin/users?q=${busqueda}`);
    const data = await res.json();
    setUsuarios(data.usuarios || []);
    setLoading(false);
  }

  useEffect(() => {
    cargarUsuarios();
  }, [busqueda]);

  async function cambiarEstado(id, nuevoEstado) {
    await fetch("/api/admin/user/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, estado: nuevoEstado })
    });

    cargarUsuarios();
  }

  function verDispositivos(id) {
    window.location.href = `/admin/dispositivos?usuario=${id}`;
  }

  function verLogs(id) {
    window.location.href = `/admin/logs?usuario=${id}`;
  }

  function editarUsuario(id) {
    window.location.href = `/admin/usuarios/editar?id=${id}`;
  }

  async function eliminarUsuario(id) {
    if (!confirm("¿Eliminar este usuario?")) return;

    await fetch("/api/admin/users/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });

    cargarUsuarios();
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">Usuarios</h1>

      <input
        type="text"
        placeholder="Buscar por email..."
        className="mb-6 w-full max-w-md p-3 rounded bg-neutral-800 text-white"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <a
        href="/admin/usuarios/nuevo"
        className="inline-block mb-6 bg-white text-black py-2 px-4 rounded font-semibold hover:bg-neutral-200 transition"
      >
        + Crear usuario
      </a>

      {loading ? (
        <p className="text-neutral-400">Cargando usuarios...</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left border-b border-neutral-800">
              <th className="p-3">ID</th>
              <th className="p-3">Email</th>
              <th className="p-3">Estado</th>
              <th className="p-3">Máx. dispositivos</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id} className="border-b border-neutral-900">
                <td className="p-3">{u.id}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">
                  <span
                    className={
                      u.estado === "activo"
                        ? "text-green-400"
                        : "text-red-400"
                    }
                  >
                    {u.estado}
                  </span>
                </td>
                <td className="p-3">{u.max_dispositivos}</td>

                <td className="p-3 space-x-4">
                  <button
                    onClick={() => verDispositivos(u.id)}
                    className="text-blue-400 hover:underline"
                  >
                    Ver dispositivos
                  </button>

                  <button
                    onClick={() => verLogs(u.id)}
                    className="text-yellow-400 hover:underline"
                  >
                    Ver logs
                  </button>

                  <button
                    onClick={() => editarUsuario(u.id)}
                    className="text-green-400 hover:underline"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() =>
                      cambiarEstado(
                        u.id,
                        u.estado === "activo" ? "suspendido" : "activo"
                      )
                    }
                    className="text-orange-400 hover:underline"
                  >
                    {u.estado === "activo" ? "Suspender" : "Activar"}
                  </button>

                  <button
                    onClick={() => eliminarUsuario(u.id)}
                    className="text-red-500 hover:underline"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
