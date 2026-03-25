"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Pencil, Trash2 } from "lucide-react";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function AdminUsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    async function load() {
      const r = await fetch("/api/admin/usuarios");
      const d = await r.json();
      setUsuarios(d.users || []);
    }
    load();
  }, []);

  return (
    <div className="space-y-6">

      {/* TÍTULO */}
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <Users size={28} /> Usuarios
      </h1>

      {/* TABLA USUARIOS */}
      <div className="overflow-x-auto rounded shadow">
        <table className="min-w-full border border-gray-300 dark:border-gray-700">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700">
              <th>Email</th>
              <th>Rol</th>
              <th>Último login</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">

                <td>{u.email}</td>
                <td>{u.user_metadata?.role || "user"}</td>
                <td>
                  {u.last_sign_in_at
                    ? new Date(u.last_sign_in_at).toLocaleString()
                    : "—"}
                </td>

                <td>
                  <div className="flex gap-3">

                    {/* VER */}
                    <Link
                      href={`/panel/admin/usuarios/${u.id}`}
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Ver
                    </Link>

                    {/* EDITAR */}
                    <button
                      onClick={async () => {
                        await fetch("/api/admin/usuarios/editar", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            id: u.id,
                            role:
                              u.user_metadata?.role === "admin"
                                ? "user"
                                : "admin",
                          }),
                        });
                        location.reload();
                      }}
                      className="text-yellow-500 dark:text-yellow-300 hover:text-yellow-400"
                    >
                      <Pencil size={18} />
                    </button>

                    {/* BORRAR */}
                    <button
                      onClick={() => {
                        setSelectedUser(u.id);
                        setOpen(true);
                      }}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
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

      {/* MODAL CONFIRMAR BORRADO */}
      <ConfirmDialog
        open={open}
        title="Eliminar usuario"
        description="Esta acción eliminará al usuario de forma permanente."
        confirmText="Eliminar"
        cancelText="Cancelar"
        onCancel={() => setOpen(false)}
        onConfirm={async () => {
          await fetch("/api/admin/usuarios/borrar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: selectedUser }),
          });

          setOpen(false);
          location.reload();
        }}
      />
    </div>
  );
}