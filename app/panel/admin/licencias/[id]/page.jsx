"use client";

import { useEffect, useState } from "react";
import ConfirmDialog from "@/components/ConfirmDialog";
import { ArrowLeft, KeyRound, CheckCircle, Clock, Ban, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function AdminLicenciaDetallePage({ params }) {
  const [licencia, setLicencia] = useState(null);
  const [accion, setAccion] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function load() {
      const r = await fetch(`/api/admin/licencias/${params.id}`);
      const d = await r.json();
      setLicencia(d.licencia || null);
    }
    load();
  }, [params.id]);

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
    window.location.reload();
  }

  if (!licencia) return <p>Cargando...</p>;

  return (
    <div className="space-y-6">

      <Link href="/panel/admin/licencias" className="text-blue-600 dark:text-blue-400 flex items-center gap-2">
        <ArrowLeft size={20} /> Volver
      </Link>

      <h1 className="text-3xl font-bold flex items-center gap-2">
        <KeyRound size={28} /> Licencia {licencia.id}
      </h1>

      <div className="p-6 rounded-lg bg-gray-200 dark:bg-gray-800 shadow space-y-4">

        <p><strong>Plugin:</strong> {licencia.plugin_id}</p>
        <p><strong>Email Tekla:</strong> {licencia.email_tekla}</p>
        <p><strong>Estado:</strong> {licencia.estado}</p>
        <p><strong>Activaciones:</strong> {licencia.activaciones_usadas} / {licencia.max_activaciones}</p>
        <p><strong>Creada:</strong> {new Date(licencia.fecha_creacion).toLocaleString()}</p>

      </div>

      <div className="flex flex-col gap-3 max-w-sm">

        <button
          onClick={() => abrirModal("activar")}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <CheckCircle size={18} /> Activar
        </button>

        <button
          onClick={() => abrirModal("trial")}
          className="btn-secondary flex items-center justify-center gap-2"
        >
          <Clock size={18} /> Poner en Trial
        </button>

        <button
          onClick={() => abrirModal("bloquear")}
          className="btn-danger flex items-center justify-center gap-2"
        >
          <Ban size={18} /> Bloquear
        </button>

        <button
          onClick={() => abrirModal("reset")}
          className="btn-secondary flex items-center justify-center gap-2"
        >
          <RefreshCw size={18} /> Reset Activaciones
        </button>

      </div>

      <ConfirmDialog
        open={open}
        title="Confirmar acción"
        description={`¿Seguro que quieres "${accion}" la licencia #${licencia.id}?`}
        confirmText="Sí"
        cancelText="Cancelar"
        onCancel={() => setOpen(false)}
        onConfirm={ejecutar}
      />

    </div>
  );
}