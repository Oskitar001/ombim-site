"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, Trash2, Eye, Edit3, PlusCircle } from "lucide-react";
import ConfirmDialog from "@/components/ConfirmDialog";

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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: selected.id }),
    });

    setOpen(false);
    load();
  }

  return (
    <div className="space-y-6">

      {/* TÍTULO */}
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <Package size={28} /> Plugins
      </h1>

      {/* NUEVO PLUGIN */}
      <Link
        href="/panel/admin/plugins/nuevo"
        className="btn-primary inline-flex items-center gap-2 w-fit"
      >
        <PlusCircle size={18} /> Nuevo plugin
      </Link>

      {/* TABLA */}
      <div className="overflow-x-auto rounded shadow mt-4">
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
                  <div className="flex gap-4 items-center">

                    {/* VER */}
                    <Tooltip label="Ver detalles">
                      <Link
                        href={`/panel/admin/plugins/${p.id}`}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800"
                      >
                        <Eye size={18} />
                      </Link>
                    </Tooltip>

                    {/* EDITAR */}
                    <Tooltip label="Editar plugin">
                      <Link
                        href={`/panel/admin/plugins/editar/${p.id}`}
                        className="text-yellow-500 dark:text-yellow-300 hover:text-yellow-600"
                      >
                        <Edit3 size={18} />
                      </Link>
                    </Tooltip>

                    {/* BORRAR */}
                    <Tooltip label="Eliminar plugin">
                      <button
                        onClick={() => confirmarBorrar(p)}
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

      {/* CONFIRM DIALOG */}
      <ConfirmDialog
        open={open}
        title="Borrar plugin"
        description={`¿Seguro que quieres eliminar el plugin "${selected?.nombre}"?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        onCancel={() => setOpen(false)}
        onConfirm={borrar}
      />
    </div>
  );
}