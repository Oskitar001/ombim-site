"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, Trash2, Eye, Edit3, PlusCircle } from "lucide-react";
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

export default function AdminPluginsPage() {
  const [plugins, setPlugins] = useState([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const r = await fetch("/api/admin/plugins", { credentials: "include" });
    const d = await r.json();
    setPlugins(d.plugins ?? []);
  }

  function confirmarBorrar(plugin) {
    setSelected(plugin);
    setOpen(true);
  }

  async function borrar() {
    await fetch("/api/admin/plugins/borrar", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: selected.id })
    });

    setOpen(false);
    load();
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Plugins</h2>

      <Link
        href="/panel/admin/plugins/nuevo"
        className="text-blue-600 flex items-center gap-2 mb-4"
      >
        <PlusCircle size={18} /> Nuevo plugin
      </Link>

      <table className="w-full">
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Versión</th>
          <th>Acciones</th>
        </tr>

        {plugins.map((p) => (
          <tr key={p.id}>
            <td>{p.id}</td>
            <td>{p.nombre}</td>
            <td>{p.version}</td>
            <td className="flex gap-3">
              <Link href={`/panel/admin/plugins/${p.id}`}>
                <Eye className="text-blue-500" />
              </Link>

              <Link href={`/panel/admin/plugins/editar/${p.id}`}>
                <Edit3 className="text-yellow-500" />
              </Link>

              <button onClick={() => confirmarBorrar(p)}>
                <Trash2 className="text-red-600" />
              </button>
            </td>
          </tr>
        ))}
      </table>

      <ConfirmDialog
        open={open}
        title="¿Eliminar plugin?"
        description="Esta acción no se puede deshacer."
        onCancel={() => setOpen(false)}
        onConfirm={borrar}
      />
    </div>
  );
}