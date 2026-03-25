"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Pencil, Trash2, Eye } from "lucide-react";
import ConfirmDialog from "@/components/ConfirmDialog";

/* Tooltip PRO reutilizable */
function Tooltip({ label, children }) {
  return (
    <div className="relative group flex items-center">
      {children}

      <div
        className="
          absolute left-1/2 -translate-x-1/2 bottom-full mb-2
          opacity-0 group-hover:opacity-100 transition
          bg-black text-white text-xs py-1 px-2 rounded shadow
          pointer-events-none whitespace-nowrap
        "
      >
        {label}
      </div>
    </div>
  );
}

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

      {/* Título */}
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <Users size={28} /> Usuarios
      </h1>

      {/* Tabla de usuarios */}
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

                {/* EMAIL */}
                <td>{u.email}</td>

                {/* ROL */}
                <td>{u.user_metadata?.role || "user"}</td>

                {/* ÚLTIMO LOGIN */}
                <td>
                  {u.last_sign_in_at
                    ? new Date(u.last_sign_in_at).toLocaleString()
                    : "—"}
                </td>

                {/* ACCIONES */}
                <td>
                  <div className="flex gap-4 items-center">

                    {/* VER */}
                    <Tooltip label="Ver usuario">
                      <Link
                        href={`/panel/admin/usuarios/${u.id}`}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800"
                      >
                        <Eye size={18} />
                      </Link>
                    </Tooltip>

                    {/* CAMBIAR ROL */}
                    <Tooltip label="Cambiar rol">
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
                        className="text-yellow-500 dark:text-yellow-300 hover:text-yellow-600"
                      >
                        <Pencil size={18} />
                      </button>
                    </Tooltip>

                    {/* BORRAR */}
                    <Tooltip label="Eliminar usuario">
                      <button
                        onClick={() => {
                          setSelectedUser(u.id);
                          setOpen(true);
                        }}
                        className="text-red-600 hover:text-red-800 dark:text-red-400"
                      >
                        <Trash2 size={18} />
                      </button>
                    </Tooltip>

                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CONFIRMAR BORRADO */}
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