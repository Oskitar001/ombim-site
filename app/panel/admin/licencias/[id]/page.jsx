"use client";

import { use, useEffect, useState } from "react";
import ConfirmDialog from "@/components/ConfirmDialog";
import { ArrowLeft, KeyRound, CheckCircle, Clock, Ban, RefreshCw } from "lucide-react";
import Link from "next/link";

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

export default function AdminLicenciaDetallePage({ params }) {
  const { id } = use(params); // Next 16 FIX

  const [licencia, setLicencia] = useState(null);
  const [accion, setAccion] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function load() {
      const r = await fetch(`/api/admin/licencias/${id}`);
      const d = await r.json();
      setLicencia(d.licencia || null);
    }
    load();
  }, [id]);

  function abrirModal(tipo) {
    setAccion(tipo);
    setOpen(true);
  }

  async function ejecutar() {
    const endpoints = {
      activar: "/api/licencias/activar",
      trial: "/api/licencias/trial",
      bloquear: "/api/licencias/bloquear",
      reset: "/api/licencias/reset-activaciones",
    };

    await fetch(endpoints[accion], {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ licencia_id: licencia.id }),
    });

    setOpen(false);
    location.reload();
  }

  if (!licencia) return <p>Cargando licencia...</p>;

  return (
    <div className="space-y-6">

      <Link
        href="/panel/admin/licencias"
        className="text-blue-600 hover:underline flex items-center gap-1"
      >
        <ArrowLeft size={20} /> Volver
      </Link>

      <h1 className="text-3xl font-bold flex items-center gap-2">
        <KeyRound size={28} /> Licencia #{licencia.id}
      </h1>

      <div className="p-6 rounded-lg bg-gray-200 dark:bg-gray-800 shadow space-y-3">

        <p>
          <strong>Plugin:</strong> {licencia.plugin_id}
        </p>

        <p>
          <strong>Email Tekla:</strong> {licencia.email_tekla}
        </p>

        <p>
          <strong>Estado:</strong>{" "}
          {licencia.estado === "pendiente" && (
            <span className="bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 px-2 py-1 rounded text-xs font-semibold">
              Pendiente
            </span>
          )}
          {licencia.estado === "activa" && (
            <span className="bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-300 px-2 py-1 rounded text-xs font-semibold">
              Activa
            </span>
          )}
          {licencia.estado === "trial" && (
            <span className="bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded text-xs font-semibold">
              Trial
            </span>
          )}
          {licencia.estado === "bloqueada" && (
            <span className="bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-300 px-2 py-1 rounded text-xs font-semibold">
              Bloqueada
            </span>
          )}
        </p>

        <p>
          <strong>Activaciones:</strong>{" "}
          {licencia.activaciones_usadas} / {licencia.max_activaciones}
        </p>

        <p>
          <strong>Creada:</strong>{" "}
          {new Date(licencia.fecha_creacion).toLocaleString()}
        </p>

      </div>

      <div className="flex flex-col gap-3 max-w-sm">

        <Tooltip label="Activar licencia">
          <button
            onClick={() => abrirModal("activar")}
            className="btn-primary flex items-center gap-2"
          >
            <CheckCircle size={18} /> Activar
          </button>
        </Tooltip>

        <Tooltip label="Poner en Trial">
          <button
            onClick={() => abrirModal("trial")}
            className="btn-secondary flex items-center gap-2"
          >
            <Clock size={18} /> Trial
          </button>
        </Tooltip>

        <Tooltip label="Bloquear licencia">
          <button
            onClick={() => abrirModal("bloquear")}
            className="btn-danger flex items-center gap-2"
          >
            <Ban size={18} /> Bloquear
          </button>
        </Tooltip>

        <Tooltip label="Reset de activaciones">
          <button
            onClick={() => abrirModal("reset")}
            className="btn-secondary flex items-center gap-2"
          >
            <RefreshCw size={18} /> Reset
          </button>
        </Tooltip>

      </div>

      <ConfirmDialog
        open={open}
        title="Confirmar acción"
        description={`¿Seguro que quieres "${accion}" la licencia #${licencia.id}?`}
        confirmText="Confirmar"
        cancelText="Cancelar"
        onCancel={() => setOpen(false)}
        onConfirm={ejecutar}
      />

    </div>
  );
}