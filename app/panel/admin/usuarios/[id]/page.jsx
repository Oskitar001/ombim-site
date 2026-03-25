"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { User, Trash2, Shield, ArrowLeft } from "lucide-react";

export default function UsuarioDetalle() {
  const params = useParams();
  const id = params.id;

  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/admin/usuarios/${id}`);
      const data = await res.json();
      setUsuario(data.user);
    }
    load();
  }, [id]);

  if (!usuario) return <p>Cargando usuario…</p>;

  return (
    <div className="space-y-6">

      <Link href="/panel/admin/usuarios" className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white">
        <ArrowLeft size={20} /> Volver
      </Link>

      <h1 className="text-2xl font-bold flex items-center gap-2">
        <User size={28} /> Usuario
      </h1>

      <div className="p-6 rounded-lg bg-gray-200 dark:bg-gray-800 space-y-3">

        <p><strong>ID:</strong> {usuario.id}</p>
        <p><strong>Email:</strong> {usuario.email}</p>
        <p><strong>Nombre:</strong> {usuario.user_metadata?.nombre ?? "—"}</p>
        <p><strong>Rol:</strong> {usuario.user_metadata?.role ?? "user"}</p>
        <p><strong>Creado:</strong> {new Date(usuario.created_at).toLocaleString()}</p>
        <p><strong>Último login:</strong> {new Date(usuario.last_sign_in_at).toLocaleString()}</p>

      </div>

      <div className="flex gap-4">

        {/* Cambiar rol */}
        <button
          onClick={async () => {
            await fetch("/api/admin/usuarios/editar", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id: usuario.id,
                role: usuario.user_metadata?.role === "admin" ? "user" : "admin",
              }),
            });
            location.reload();
          }}
          className="px-4 py-2 bg-yellow-500 dark:bg-yellow-300 hover:bg-yellow-400 text-black rounded flex items-center gap-2"
        >
          <Shield size={18} />
          Cambiar rol
        </button>

        {/* Borrar */}
        <button
          onClick={async () => {
            if (!confirm("¿Seguro que quieres borrar este usuario?")) return;

            await fetch("/api/admin/usuarios/borrar", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id: usuario.id }),
            });

            window.location.href = "/panel/admin/usuarios";
          }}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded flex items-center gap-2"
        >
          <Trash2 size={18} /> Borrar usuario
        </button>

      </div>

    </div>
  );
}