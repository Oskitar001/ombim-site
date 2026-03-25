"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import ConfirmDialog from "@/components/ConfirmDialog";
import { ArrowLeft, User, Trash2 } from "lucide-react";

/* Tooltip PRO */
function Tooltip({ label, children }) {
  return (
    <div className="relative group flex items-center">
      {children}
      <div
        className="
          absolute left-1/2 -translate-x-1/2 bottom-full mb-2
          opacity-0 group-hover:opacity-100 transition
          bg-black text-white text-xs py-1 px-2 rounded shadow
          whitespace-nowrap pointer-events-none
        "
      >
        {label}
      </div>
    </div>
  );
}

export default function AdminUsuarioDetallePage({ params }) {
  const { id } = use(params); // Next.js 16 FIX

  const [usuario, setUsuario] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function load() {
      const r = await fetch(`/api/admin/usuarios/${id}`);
      const d = await r.json();
      setUsuario(d.user || null);
    }
    load();
  }, [id]);

  async function borrarUsuario() {
    await fetch("/api/admin/usuarios/borrar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    setOpen(false);
    window.location.href = "/panel/admin/usuarios";
  }

  if (!usuario) return <p>Cargando usuario...</p>;

  return (
  <div className="space-y-6">

    <Link href="/panel/admin/usuarios" className="flex items-center gap-2">
      <ArrowLeft size={20} /> Volver
    </Link>

    <h1 className="text-3xl font-bold flex items-center gap-2">
      <User size={28} /> Usuario
    </h1>

    <div className="p-6 bg-gray-200 dark:bg-gray-800 rounded-lg shadow space-y-4">
      <p>
        <strong>Email:</strong> {usuario.email}
      </p>

      <p>
        <strong>Rol:</strong> {usuario.user_metadata?.role || "user"}
      </p>

      <p>
        <strong>Último login:</strong>{" "}
        {usuario.last_sign_in_at
          ? new Date(usuario.last_sign_in_at).toLocaleString()
          : "—"}
      </p>

      <p>
        <strong>Creación:</strong>{" "}
        {new Date(usuario.created_at).toLocaleString()}
      </p>
    </div>

    <div className="max-w-xs">
      <Tooltip label="Eliminar usuario">
        <button
          onClick={() => setOpen(true)}
          className="btn-danger flex items-center gap-2 w-full justify-center"
        >
          <Trash2 size={18} /> Borrar usuario
        </button>
      </Tooltip>
    </div>

    <ConfirmDialog
      open={open}
      title="Eliminar usuario"
      description="Esta acción eliminará permanentemente al usuario."
      confirmText="Eliminar"
      cancelText="Cancelar"
      onCancel={() => setOpen(false)}
      onConfirm={borrarUsuario}
    />

  </div>
);
}