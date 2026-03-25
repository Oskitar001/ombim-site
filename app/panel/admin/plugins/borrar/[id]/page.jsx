
"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";

export default function BorrarPluginPage({ params }) {
  const { id } = params;
  const [confirm, setConfirm] = useState(false);

  async function borrar() {
    await fetch("/api/admin/plugins/borrar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });
    window.location.href = "/panel/admin/plugins";
  }

  return (
    <div className="space-y-6 p-4 max-w-xl mx-auto">
      <Link href="/panel/admin/plugins" className="flex items-center gap-2">
        <ArrowLeft size={20} /> Volver
      </Link>

      <h1 className="text-3xl font-bold text-red-600 flex items-center gap-2">
        <Trash2 size={26} /> Eliminar Plugin
      </h1>

      <p className="text-gray-700 dark:text-gray-300">
        ¿Estás seguro de que deseas eliminar este plugin? Esta acción no se puede deshacer.
      </p>

      {!confirm && (
        <button
          onClick={() => setConfirm(true)}
          className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700"
        >
          Sí, eliminar
        </button>
      )}

      {confirm && (
        <button
          onClick={borrar}
          className="w-full bg-red-800 text-white py-3 rounded-lg hover:bg-red-900"
        >
          Confirmar eliminación
        </button>
      )}
    </div>
  );
}
