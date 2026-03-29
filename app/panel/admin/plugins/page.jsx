"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, Trash2, Eye, Edit3, Download } from "lucide-react";

export default function AdminPluginsPage() {
  const [plugins, setPlugins] = useState([]);
  const [descargas, setDescargas] = useState({});
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    async function load() {
      // Obtener plugins
      const r1 = await fetch("/api/admin/plugins", { credentials: "include" });
      const d1 = await r1.json();

      // 🔥 FIX: ahora la API SIEMPRE devuelve { plugins: [...] }
      setPlugins(Array.isArray(d1.plugins) ? d1.plugins : []);

      // Obtener descargas por plugin
      const r2 = await fetch("/api/admin/dashboard");
      const d2 = await r2.json();
      setDescargas(d2.descargasPorPlugin ?? {});
    }
    load();
  }, []);

  function confirmarBorrar(plugin) {
    setSelected(plugin);
    setOpen(true);
  }

  async function borrar() {
    await fetch("/api/admin/plugins/borrar", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: selected.id }),
    });

    setOpen(false);
    location.reload();
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Plugins</h2>

      <Link
        href="/panel/admin/plugins/nuevo"
        className="text-blue-600 flex items-center gap-2 mb-4"
      >
        <Package size={18} /> Nuevo plugin
      </Link>

      <table className="w-full border border-gray-300 dark:border-gray-700">
        <thead>
          <tr className="bg-gray-300 dark:bg-gray-700">
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Precios</th>
            <th>Descargas</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {plugins.map((p) => (
            <tr
              key={p.id}
              className="border-b border-gray-300 dark:border-gray-700"
            >
              <td className="p-2 text-center">
                {p.imagen_url ? (
                  <img
                    src={p.imagen_url}
                    alt={p.nombre}
                    className="w-16 h-16 object-cover rounded"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-400 rounded" />
                )}
              </td>

              <td className="font-semibold">{p.nombre}</td>

              {/* Mostrar precios */}
              <td className="p-2 text-sm">
                <div>
                  <strong>Estándar:</strong>{" "}
                  {p.precio > 0 ? `${p.precio} €` : "—"}
                </div>
                <div>
                  <strong>Anual:</strong>{" "}
                  {p.precio_anual > 0 ? `${p.precio_anual} €` : "—"}
                </div>
                <div>
                  <strong>Completa:</strong>{" "}
                  {p.precio_completa > 0 ? `${p.precio_completa} €` : "—"}
                </div>
              </td>

              <td className="text-center">
                <span className="flex items-center gap-1 justify-center">
                  <Download size={16} />
                  {descargas[p.id] ?? 0}
                </span>
              </td>

              <td className="flex gap-3 py-2 justify-center">
                <Link href={`/panel/admin/plugins/${p.id}`}>
                  <Eye className="text-blue-600 hover:text-blue-800" />
                </Link>

                <Link href={`/panel/admin/plugins/editar/${p.id}`}>
                  <Edit3 className="text-yellow-500 hover:text-yellow-600" />
                </Link>

                <button onClick={() => confirmarBorrar(p)}>
                  <Trash2 className="text-red-600 hover:text-red-800" />
                </button>
              </td>
            </tr>
          ))}

          {!plugins.length && (
            <tr>
              <td colSpan="5" className="text-center p-4 opacity-70">
                No hay plugins creados.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* MODAL BORRADO */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white dark:bg-gray-900 p-6 rounded shadow space-y-4 max-w-md">
            <h3 className="font-bold text-xl">¿Eliminar plugin?</h3>
            <p>Esta acción no se puede deshacer.</p>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded"
              >
                Cancelar
              </button>

              <button
                onClick={borrar}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}