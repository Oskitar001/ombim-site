// ======================================================
// 1) BOTÓN EDITAR EN LA TABLA DE USUARIOS
//    (app/admin/users/page.jsx)
// ======================================================
"use client";
import { useEffect, useState } from "react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const loadUsers = () => {
    setLoading(true);
    fetch("/api/admin/users/list")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.users || []);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const changeRole = async (userId, role) => {
    setActionLoading(true);
    await fetch("/api/admin/users/role", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, role }),
    });
    setActionLoading(false);
    loadUsers();
  };

  const deleteUser = async (userId) => {
    if (!confirm("¿Seguro que quieres eliminar este usuario?")) return;
    setActionLoading(true);
    await fetch(`/api/admin/users/delete?userId=${userId}`, {
      method: "DELETE",
    });
    setActionLoading(false);
    loadUsers();
  };

  if (loading) return <div className="p-10">Cargando usuarios...</div>;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Gestión de Usuarios</h1>
      {actionLoading && <p className="mb-4 text-sm text-gray-500">Aplicando cambios...</p>}

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 text-left">Nombre</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Rol</th>
            <th className="p-2 text-left">Creado</th>
            <th className="p-2 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => {
            const role = u.user_metadata?.role || "user";
            return (
              <tr key={u.id} className="border-b">
                <td className="p-2">{u.user_metadata?.nombre || "—"}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">{role}</td>
                <td className="p-2">
                  {u.created_at ? new Date(u.created_at).toLocaleString() : "—"}
                </td>
                <td className="p-2 space-x-2">
                  
                  {/* 🔥 NUEVO: BOTÓN EDITAR */}
                  <button
                    className="px-2 py-1 text-xs bg-green-600 text-white rounded"
                    onClick={() => window.location.href = `/admin/users/${u.id}`}
                  >
                    Editar
                  </button>

                  <button
                    className="px-2 py-1 text-xs bg-blue-600 text-white rounded"
                    onClick={() => changeRole(u.id, role === "admin" ? "user" : "admin")}
                  >
                    Hacer {role === "admin" ? "user" : "admin"}
                  </button>

                  <button
                    className="px-2 py-1 text-xs bg-red-600 text-white rounded"
                    onClick={() => deleteUser(u.id)}
                  >
                    Eliminar
                  </button>

                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}