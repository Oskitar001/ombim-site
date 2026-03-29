"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function AdminUsuarioDetallePage({ params }) {

  // 🔥 EN NEXT.JS 16 params ES UN PROMISE
  const { id } = use(params);

  const [usuario, setUsuario] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function load() {
      const r = await fetch(`/api/admin/usuarios/${id}`, {
        credentials: "include",
      });

      if (!r.ok) {
        setUsuario(null);
        return;
      }

      const d = await r.json();
      setUsuario(d.user ?? null);
    }

    load();
  }, [id]);

  async function borrarUsuario() {
    await fetch("/api/admin/usuarios/borrar", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    window.location.href = "/panel/admin/usuarios";
  }

  if (!usuario) return <p className="p-4">Cargando usuario...</p>;

  return (
    <div className="p-4">
      <Link
        href="/panel/admin/usuarios"
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
      >
        <ArrowLeft size={18} /> Volver
      </Link>

      <h2 className="text-2xl font-bold my-4">Usuario</h2>

      <p>
        <strong>Email:</strong> {usuario.email}
      </p>
      <p>
        <strong>Rol:</strong> {usuario.user_metadata?.role ?? "user"}
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

      <button
        onClick={() => setOpen(true)}
        className="btn-danger flex items-center gap-2 w-full justify-center mt-6"
      >
        <Trash2 size={18} /> Borrar usuario
      </button>

      <ConfirmDialog
        open={open}
        onCancel={() => setOpen(false)}
        onConfirm={borrarUsuario}
      />
    </div>
  );
}