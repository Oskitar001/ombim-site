"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUsers() {
      const res = await fetch("/api/admin/users");
      const data = await res.json();

      if (data.users) {
        setUsers(data.users);
      }

      setLoading(false);
    }

    loadUsers();
  }, []);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">
        Dashboard
      </h1>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 rounded-xl shadow-lg text-white bg-gradient-to-br from-blue-500 to-blue-700">
          <p className="text-lg">Usuarios</p>
          <p className="text-4xl font-bold mt-2">
            {loading ? "..." : users.length}
          </p>
        </div>

        <div className="p-6 rounded-xl shadow-lg text-white bg-gradient-to-br from-purple-500 to-purple-700">
          <p className="text-lg">Dispositivos</p>
          <p className="text-4xl font-bold mt-2">0</p>
        </div>

        <div className="p-6 rounded-xl shadow-lg text-white bg-gradient-to-br from-green-500 to-green-700">
          <p className="text-lg">Logs</p>
          <p className="text-4xl font-bold mt-2">0</p>
        </div>
      </div>

      {/* Lista de usuarios */}
      <div className="bg-white dark:bg-neutral-950 rounded-xl shadow-lg border border-gray-200 dark:border-neutral-800 p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Usuarios registrados
        </h2>

        {loading ? (
          <p className="text-gray-600">Cargando...</p>
        ) : users.length === 0 ? (
          <p className="text-gray-600">No hay usuarios registrados.</p>
        ) : (
          <ul className="space-y-3">
            {users.map((u) => (
              <li
                key={u.id}
                className="border p-4 rounded-lg flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{u.email}</p>
                  <p className="text-sm text-gray-500">
                    Estado: {u.estado} — Rol: {u.role}
                  </p>
                </div>
                <span className="text-sm text-gray-400">
                  Expira: {u.fecha_expiracion}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
