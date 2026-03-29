"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Trash2, AlertTriangle } from "lucide-react";

export default function BorrarPluginPage() {
  const { id } = useParams();

  const [plugin, setPlugin] = useState(null);
  const [loading, setLoading] = useState(true);

  // ======================================================
  // CARGAR DATOS DEL PLUGIN
  // ======================================================
  useEffect(() => {
    async function load() {
      try {
        const r = await fetch(`/api/admin/plugins/${id}`, {
          credentials: "include",
        });

        const d = await r.json();

        if (!r.ok) {
          alert(d.error ?? "Error cargando plugin");
          return;
        }

        setPlugin(d);
      } catch (e) {
        alert("Error conectando con el servidor");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  // ======================================================
  // ELIMINAR PLUGIN
  // ======================================================
  async function borrar() {
    const r = await fetch("/api/admin/plugins/borrar", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    const d = await r.json();

    if (!r.ok) {
      alert(d.error ?? "Error borrando plugin");
      return;
    }

    window.location.href = "/panel/admin/plugins?deleted=1";
  }

  // ======================================================
  // UI
  // ======================================================

  if (loading) return <p className="p-4">Cargando…</p>;
  if (!plugin) return <p className="p-4">Plugin no encontrado.</p>;

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-8">

      {/* VOLVER */}
      <Link href="/panel/admin/plugins" className="flex items-center gap-2 text-blue-600 hover:underline">
        <ArrowLeft size={20} /> Volver
      </Link>

      {/* TÍTULO */}
      <h1 className="text-3xl font-bold text-red-600 flex items-center gap-2">
        <Trash2 size={30} /> Eliminar Plugin
      </h1>

      {/* CARD PRINCIPAL */}
      <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl shadow p-6 space-y-6">

        {/* INFO PLUGIN */}
        <div className="flex gap-4 items-center">
          {plugin.imagen_url ? (
            <img
              src={plugin.imagen_url}
              alt={plugin.nombre}
              className="w-24 h-24 rounded-lg object-cover shadow"
            />
          ) : (
            <div className="w-24 h-24 rounded-lg bg-gray-300 dark:bg-gray-700" />
          )}

          <div>
            <h2 className="text-xl font-bold">{plugin.nombre}</h2>
            <p className="text-sm opacity-80">{plugin.descripcion}</p>
          </div>
        </div>

        {/* PRECIOS */}
        <div className="space-y-1 text-sm">
          <p>
            <strong>Estándar:</strong>{" "}
            {plugin.precio > 0 ? `${plugin.precio} €` : "—"}
          </p>
          <p>
            <strong>Anual:</strong>{" "}
            {plugin.precio_anual > 0 ? `${plugin.precio_anual} €` : "—"}
          </p>
          <p>
            <strong>Completa:</strong>{" "}
            {plugin.precio_completa > 0 ? `${plugin.precio_completa} €` : "—"}
          </p>
        </div>

        {/* ADVERTENCIA */}
        <div className="p-4 rounded-lg border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900 text-red-900 dark:text-red-100 flex gap-3">
          <AlertTriangle size={26} className="text-red-700 dark:text-red-300" />
          <p>
            Estás a punto de eliminar este plugin <strong>PERMANENTEMENTE</strong>.<br />
            Esta acción no se puede deshacer.
          </p>
        </div>

        {/* BOTONES */}
        <div className="flex justify-end gap-4">

          <Link href="/panel/admin/plugins">
            <button className="px-4 py-2 border border-gray-400 dark:border-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800">
              Cancelar
            </button>
          </Link>

          <button
            onClick={borrar}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2 shadow"
          >
            <Trash2 size={18} /> Eliminar definitivamente
          </button>
        </div>
      </div>
    </div>
  );
}