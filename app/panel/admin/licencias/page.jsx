"use client";

import { useEffect, useState } from "react";
import ConfirmDialog from "@/components/ConfirmDialog";
import { Ticket, CheckCircle, Ban, RefreshCw, Clock } from "lucide-react";
import Link from "next/link";

export default function AdminLicenciasPage() {
  const [licencias, setLicencias] = useState([]);
  const [open, setOpen] = useState(false);
  const [accion, setAccion] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const r = await fetch("/api/admin/licencias");
    const d = await r.json();
    setLicencias(d.licencias || []);
  }

  function abrirModal(licencia, tipo) {
    setSelected(licencia);
    setAccion(tipo);
    setOpen(true);
  }

  async function ejecutarAccion() {
    if (!selected || !accion) return;

    const endpoints = {
      activar: "/api/licencias/activar",
      trial: "/api/licencias/trial",
      bloquear: "/api/licencias/bloquear",
      reset: "/api/licencias/reset-activaciones",
    };

    await fetch(endpoints[accion], {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ licencia_id: selected.id }),
    });

    setOpen(false);
    load();
  }

  return (
    <div className="space-y-6">

      <h1 className="text-3xl font-bold flex items-center gap-2">
        <Ticket size={28} /> Licencias
      </h1>

      <div className="overflow-x-auto rounded shadow">
        <table className="min-w-full border border-gray-300 dark:border-gray-700">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700 text-left">
              <th>ID</th>
              <th>Plugin</th>
              <th>Email Tekla</th>
              <th>Estado</th>
              <th>Activaciones</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {licencias.map((l) => (
              <tr
                key={l.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td>{l.id}</td>
                <td>{l.plugin_id}</td>
                <td>{l.email_tekla}</td>

                <td className="capitalize">{l.estado}</td>

                <td>
                  {l.activaciones_usadas} / {l.max_activaciones}
                </td>

                <td>
                  {new Date(l.fecha_creacion).toLocaleString()}
                </td>

                <td>
                  <div className="flex gap-3">

                    {/* VER */}
                    <Link
                      href={`/panel/admin/licencias/${l.id}`}
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Ver
                    </Link>

                    {/* ACTIVAR */}
                    <button
                      onClick={() => abrirModal(l, "activar")}
                      className="text-green-600 hover:text-green-800 dark:text-green-400"
                    >
                      <CheckCircle size={18} />
                    </button>

                    {/* TRIAL */}
                    <button
                      onClick={() => abrirModal(l, "trial")}
                      className="text-yellow-500 hover:text-yellow-700 dark:text-yellow-300"
                    >
                      <Clock size={18} />
                    </button>

                    {/* BLOQUEAR */}
                    <button
                      onClick={() => abrirModal(l, "bloquear")}
                      className="text-red-600 hover:text-red-800 dark:text-red-400"
                    >
                      <Ban size={18} />
                    </button>

                    {/* RESET ACTIVACIONES */}
                    <button
                      onClick={() => abrirModal(l, "reset")}
                      className="text-purple-600 hover:text-purple-800 dark:text-purple-300"
                    >
                      <RefreshCw size={18} />
                    </button>

                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={open}
        title="Confirmar acción"
        description={`¿Seguro que quieres ejecutar la acción "${accion}" para la licencia ${selected?.id}?`}
        confirmText="Confirmar"
        cancelText="Cancelar"
        onCancel={() => setOpen(false)}
        onConfirm={ejecutarAccion}
      />

    </div>
  );
}
