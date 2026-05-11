"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, Trash2, Eye, Edit3 } from "lucide-react";

export default function AdminPluginsPage() {
  const [plugins, setPlugins] = useState([]);
  const [descargas, setDescargas] = useState({});
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    async function load() {
      const r1 = await fetch("/api/admin/plugins", { credentials: "include" });
      const d1 = await r1.json();
      setPlugins(Array.isArray(d1.plugins) ? d1.plugins : []);

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
    <div className="space-y-6 p-4 max-w-6xl mx-auto">

      {/* TÍTULO */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold flex items-center gap-2">
          <Package size={28} />
          Plugins
        </h2>

        <Link
          href="/panel/admin/plugins/nuevo"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow hover:bg-blue-700"
        >
          <Package size={18} />
          Nuevo plugin
        </Link>
      </div>

      {/* ================= MÓVIL ================= */}
      <div className="grid gap-4 md:hidden">
        {plugins.map((p) => (
          <div
            key={p.id}
            className="bg-white dark:bg-gray-900 border rounded-xl shadow p-4 space-y-3"
          >
            <div className="flex items-center gap-4">
              {p.imagen_url ? (
                <img
                  src={p.imagen_url}
                  className="w-20 h-20 object-cover rounded-xl"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-400 rounded-xl" />
              )}

              <div className="flex-1">
                <h3 className="text-lg font-bold">{p.nombre}</h3>
                <p className="text-sm opacity-75">
                  Descargas: {descargas[p.id] ?? 0}
                </p>
              </div>
            </div>

            {/* ✅ PRECIOS CORRECTOS */}
            <div className="text-sm space-y-1">
              {p.permite_trimestral && (
                <div>💶 Trimestral: {Number(p.precio_trimestral).toFixed(2)} €</div>
              )}
              {p.permite_anual && (
                <div>📅 Anual: {Number(p.precio_anual).toFixed(2)} €</div>
              )}
              {p.permite_completa && (
                <div>⭐ Completa: {Number(p.precio_completa).toFixed(2)} €</div>
              )}
            </div>

            {/* ACCIONES */}
            <div className="flex gap-4 justify-end">
              <Link href={`/panel/admin/plugins/${p.id}`}>
                <Eye className="text-blue-600" />
              </Link>

              <Link href={`/panel/admin/plugins/editar/${p.id}`}>
                <Edit3 className="text-yellow-500" />
              </Link>

              <button onClick={() => confirmarBorrar(p)}>
                <Trash2 className="text-red-600" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= ESCRITORIO ================= */}
      <div className="hidden md:block border rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-200 dark:bg-gray-800 text-left text-sm">
            <tr>
              <th className="p-3">Imagen</th>
              <th className="p-3">Nombre</th>
              <th className="p-3">Precios</th>
              <th className="p-3 text-center">Descargas</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {plugins.map((p) => (
              <tr key={p.id} className="border-t hover:bg-gray-50">

                <td className="p-3 text-center">
                  {p.imagen_url ? (
                    <img
                      src={p.imagen_url}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-400 rounded" />
                  )}
                </td>

                <td className="p-3 font-semibold">{p.nombre}</td>

                {/* ✅ PRECIOS CORREGIDOS */}
                <td className="p-3 space-y-1">
                  {p.permite_trimestral && (
                    <div>💶 Trimestral: {Number(p.precio_trimestral).toFixed(2)} €</div>
                  )}
                  {p.permite_anual && (
                    <div>📅 Anual: {Number(p.precio_anual).toFixed(2)} €</div>
                  )}
                  {p.permite_completa && (
                    <div>⭐ Completa: {Number(p.precio_completa).toFixed(2)} €</div>
                  )}
                </td>

                <td className="p-3 text-center font-semibold">
                  {descargas[p.id] ?? 0}
                </td>

                <td className="p-3">
                  <div className="flex justify-center gap-4">
                    <Link href={`/panel/admin/plugins/${p.id}`}>
                      <Eye className="text-blue-600" />
                    </Link>

                    <Link href={`/panel/admin/plugins/editar/${p.id}`}>
                      <Edit3 className="text-yellow-500" />
                    </Link>

                    <button onClick={() => confirmarBorrar(p)}>
                      <Trash2 className="text-red-600" />
                    </button>
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl shadow-xl space-y-4">
            <h3 className="font-bold text-xl">¿Eliminar plugin?</h3>
            <p>Esta acción no se puede deshacer.</p>

            <div className="flex justify-end gap-4">
              <button onClick={() => setOpen(false)}>Cancelar</button>
              <button onClick={borrar} className="bg-red-600 text-white px-4 py-2 rounded">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
