"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Eye } from "lucide-react";

export default function AdminUsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const r = await fetch("/api/admin/usuarios", {
          credentials: "include",
        });

        const d = await r.json();

        setUsuarios(Array.isArray(d.users) ? d.users : []);
      } catch (e) {
        console.error("Error cargando usuarios", e);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) return <p className="p-4">Cargando usuarios...</p>;

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-8">

      {/* TÍTULO */}
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <Users size={28} /> Usuarios
      </h1>

      {/* =======================
          MÓVIL → VERSION CARDS
      ======================= */}
      <div className="grid gap-4 md:hidden">
        {usuarios.map((u) => (
          <div
            key={u.id}
            className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-300 dark:border-gray-700 shadow space-y-3"
          >
            <p className="font-semibold text-lg">{u.email}</p>

            <p className="opacity-70 text-sm">
              Registrado:{" "}
              {u.created_at
                ? new Date(u.created_at).toLocaleString()
                : "—"}
            </p>

            <div className="flex justify-end">
              <Link
                href={`/panel/admin/usuarios/${u.id}`}
                className="text-blue-600 dark:text-blue-400 flex items-center gap-1 font-semibold"
              >
                <Eye size={16} /> Ver detalles
              </Link>
            </div>
          </div>
        ))}

        {!usuarios.length && (
          <p className="text-center opacity-70">No hay usuarios registrados.</p>
        )}
      </div>

      {/* =======================
          DESKTOP → TABLA PREMIUM
      ======================= */}
      <div className="hidden md:block rounded-xl border border-gray-300 dark:border-gray-700 overflow-hidden shadow">
        <table className="w-full text-left">
          <thead className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wide">
            <tr>
              <th className="p-3">Email</th>
              <th className="p-3">Fecha registro</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>

          <tbody className="text-sm">
            {usuarios.map((u) => (
              <tr
                key={u.id}
                className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition"
              >
                <td className="p-3 font-medium">{u.email}</td>

                <td className="p-3">
                  {u.created_at
                    ? new Date(u.created_at).toLocaleString()
                    : "—"}
                </td>

                <td className="p-3 text-center">
                  <Link
                    href={`/panel/admin/usuarios/${u.id}`}
                    className="text-blue-600 dark:text-blue-400 hover:underline font-semibold flex items-center justify-center gap-1"
                  >
                    <Eye size={16} /> Ver
                  </Link>
                </td>
              </tr>
            ))}

            {!usuarios.length && (
              <tr>
                <td colSpan="3" className="p-4 text-center opacity-70">
                  No hay usuarios registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}