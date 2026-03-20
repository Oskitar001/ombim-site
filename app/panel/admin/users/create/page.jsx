"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function UsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function cargar() {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(data || []);
    }
    cargar();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Usuarios</h1>

      <Link
        href="/panel/admin/users/create"
        className="bg-blue-600 text-white px-4 py-2 rounded inline-block mb-4"
      >
        Crear usuario
      </Link>

      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2">ID</th>
            <th className="p-2">Email</th>
            <th className="p-2">Nombre</th>
            <th className="p-2">Rol</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-t">
              <td className="p-2">{u.id}</td>
              <td className="p-2">{u.email}</td>
              <td className="p-2">{u.nombre}</td>
              <td className="p-2">{u.role}</td>
              <td className="p-2">
                <Link href={`/panel/admin/users/view/${u.id}`} className="text-blue-600 mr-3">
                  Ver
                </Link>
                <Link href={`/panel/admin/users/edit/${u.id}`} className="text-green-600">
                  Editar
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
