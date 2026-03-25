"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Users, Trash2, Pencil, Eye, Search } from "lucide-react";

export const dynamic = "force-dynamic";

export default function AdminUsuariosPage() {
  const params = useSearchParams();        // ✅ LEER SEARCH PARAMS CORRECTAMENTE
  const queryURL = params.get("q") ?? "";  // ✅ YA NO DA ERROR

  const [usuarios, setUsuarios] = useState([]);
  const [query, setQuery] = useState(queryURL);

  // Cargar usuarios desde API
  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/admin/usuarios${query ? `?q=${query}` : ""}`);
      const data = await res.json();
      setUsuarios(data.users);
    }
    load();
  }, [query]);

  return (
    <div className="space-y-6">

      {/* TÍTULO */}
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Users size={28} /> Usuarios
      </h1>

      {/* BUSCADOR */}
      <form
        className="flex items-center gap-2 max-w-md"
        onSubmit={(e) => {
          e.preventDefault();
          setQuery(e.target.q.value);
        }}
      >
        <Search size={20} className="text-gray-600 dark:text-gray-300" />

        <input
          type="text"
          name="q"
          placeholder="Buscar por email o ID…"
          defaultValue={query}
          className="flex-1 border p-2 rounded dark:bg-[#1f1f1f] dark:text-white"
        />

        <button className="px-3 py-2 bg-blue-600 text-white rounded">
          Buscar
        </button>
      </form>

      {/* TABLA */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 dark:border-gray-700">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700">
              <th className="border px-3 py-2">Email</th>
              <th className="border px-3 py-2 hidden md:table-cell">Rol</th>
              <th className="border px-3 py-2 hidden md:table-cell">Último login</th>
              <th className="border px-3 py-2">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">

                <td className="border px-3 py-2">{u.email}</td>

                <td className="border px-3 py-2 hidden md:table-cell">
                  {u.user_metadata?.role ?? "user"}
                </td>

                <td className="border px-3 py-2 hidden md:table-cell">
                  {u.last_sign_in_at
                    ? new Date(u.last_sign_in_at).toLocaleString()
                    : "—"}
                </td>

                <td className="border px-3 py-2">
                  <div className="flex gap-4">

                    {/* VER */}
                    <Link
                      href={`/panel/admin/usuarios/${u.id}`}
                      className="text-gray-500 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
                    >
                      <Eye size={18} />
                    </Link>

                    {/* EDITAR */}
                    <button
                      onClick={async () => {
                        await fetch("/api/admin/usuarios/editar", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            id: u.id,
                            role: u.user_metadata?.role === "admin" ? "user" : "admin",
                          }),
                        });
                        location.reload();
                      }}
                      className="text-yellow-500 hover:text-yellow-400 dark:text-yellow-300 dark:hover:text-yellow-200"
                    >
                      <Pencil size={18} />
                    </button>

                    {/* BORRAR */}
                    <button
                      onClick={async () => {
                        if (!confirm("¿Eliminar usuario?")) return;

                        await fetch("/api/admin/usuarios/borrar", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ id: u.id }),
                        });

                        location.reload();
                      }}
                      className="text-red-500 hover:text-red-300 dark:text-red-300 dark:hover:text-red-200"
                    >
                      <Trash2 size={18} />
                    </button>

                  </div>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
}