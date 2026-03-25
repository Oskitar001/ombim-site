"use client";

import { useEffect, useState } from "react";
import ConfirmDialog from "@/components/ConfirmDialog";
import { Package, Trash2 } from "lucide-react";
import Link from "next/link";

export default function AdminPluginsPage() {
  const [plugins, setPlugins] = useState([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const r = await fetch("/api/admin/plugins");
    const d = await r.json();
    setPlugins(d.plugins || []);
  }

  function confirmarBorrar(plugin) {
    setSelected(plugin);
    setOpen(true);
  }

  async function borrar() {
    await fetch("/api/admin/plugins/borrar", {
      method: "POST",
      body: JSON.stringify({ id: selected.id }),
      headers: { "Content-Type": "application/json" },
    });
    setOpen(false);
    load();
  }

  return (
    <div className="space-y-6">

      <h1 className="text-3xl font-bold flex items-center gap-2">
        <Package size={28} /> Plugins
      </h1>

      <Link
        href="/panel/admin/plugins/nuevo"
        className="btn btn-primary"
      >
        Nuevo plugin
      </Link>

      <div className="overflow-x-auto rounded shadow">
        <table className="min-w-full border border-gray-300 dark:border-gray-700">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700 text-left">
              <th>ID</th>
              <th>Nombre</th>
              <th>Versión</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {plugins.map((p) => (
              <tr
                key={p.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td>{p.id}</td>
                <td>{p.nombre}</td>
                <td>{p.version}</td>

                <td>
                  <button
                    onClick={() => confirmarBorrar(p)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={open}
        title="Borrar plugin"
        description={`¿Seguro que quieres borrar el plugin "${selected?.nombre}"?`}
        confirmText="Borrar"
        cancelText="Cancelar"
        onCancel={() => setOpen(false)}
        onConfirm={borrar}
      />

    </div>
  );
}