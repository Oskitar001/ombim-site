"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Pencil, Trash2, Eye } from "lucide-react";
import ConfirmDialog from "@/components/ConfirmDialog";

function Tooltip({ label, children }) {
  return (
    <span className="relative group">
      {children}
      <span className="absolute hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
        {label}
      </span>
    </span>
  );
}

export default function AdminUsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [me, setMe] = useState(null);

  // Obtener lista de usuarios
  useEffect(() => {
    async function load() {
      const r = await fetch("/api/admin/usuarios", {
        credentials: "include"
      });
      const d = await r.json();
      setUsuarios(d.users ?? []);
    }
    load();
  }, []);

  // Obtener datos del admin actual (para evitar autodestruirse)
  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setMe(d.user ?? null));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Usuarios</h2>

      <table className="w-full">
        <tr>
          <th>Email</th>
          <th>Rol</th>
          <th>Último login</th>
          <th>Acciones</th>
        </tr>

        {usuarios.map((u) => (
          <tr key={u.id}>
            {/* EMAIL */}
            <td>{u.email}</td>

            {/* ROL */}
            <td>{u.user_metadata?.role ?? "user"}</td>

            {/* ULTIMO LOGIN */}
            <td>
              {u.last_sign_in_at
                ? new Date(u.last_sign_in_at).toLocaleString()
                : "—"}
            </td>

            {/* ACCIONES */}
            <td className="flex gap-4">

              {/* VER */}
              <Link href={`/panel/admin/usuarios/${u.id}`}>
                <Eye className="text-blue-500 hover:text-blue-700" />
              </Link>

              {/* CAMBIAR ROL — NO permitirse a sí mismo */}
              {me && me.id !== u.id && (
                <button
                  onClick={async () => {
                    await fetch("/api/admin/usuarios/editar", {
                      method: "POST",
                      credentials: "include",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        id: u.id,
                        role: u.user_metadata?.role === "admin" ? "user" : "admin"
                      })
                    });
                    location.reload();
                  }}
                >
                  <Pencil className="text-yellow-500 hover:text-yellow-600" />
                </button>
              )}

              {/* BORRAR — NO permitirse a sí mismo */}
              {me && me.id !== u.id && (
                <button
                  onClick={() => {
                    setSelectedUser(u.id);
                    setOpen(true);
                  }}
                >
                  <Trash2 className="text-red-600 hover:text-red-800" />
                </button>
              )}
            </td>
          </tr>
        ))}
      </table>

      {/* CONFIRMAR BORRADO */}
      <ConfirmDialog
        open={open}
        onCancel={() => setOpen(false)}
        onConfirm={async () => {
          await fetch("/api/admin/usuarios/borrar", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: selectedUser })
          });

          setOpen(false);
          location.reload();
        }}
      />
    </div>
  );
}