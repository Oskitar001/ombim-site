"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import ConfirmDialog from "@/components/ConfirmDialog";
import { ArrowLeft, CreditCard, CheckCircle } from "lucide-react";

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

export default function AdminPagoDetallePage({ params }) {
  const { id } = use(params);
  const [pago, setPago] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function load() {
      const r = await fetch(`/api/admin/pagos/${id}`);
      const d = await r.json();
      setPago(d.pago || null);
    }
    load();
  }, [id]);

  async function validarPago() {
    await fetch(`/api/admin/pagos/validar/${pago.id}`, {
      method: "POST",
    });

    setOpen(false);
    window.location.reload();
  }

  if (!pago) return <p>Cargando pago...</p>;
  return (
    <div className="space-y-6">

      <Link href="/panel/admin/pagos" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline">
        <ArrowLeft size={20} /> Volver
      </Link>

      <h1 className="text-3xl font-bold flex items-center gap-2">
        <CreditCard size={28} /> Pago #{pago.id}
      </h1>

      {/* CARD DE INFORMACIÓN DEL PAGO */}
      <div className="p-6 rounded-lg bg-gray-200 dark:bg-gray-800 shadow space-y-3">

        <p>
          <strong>Usuario:</strong> {pago.user_email}
        </p>

        <p>
          <strong>Plugin:</strong> {pago.plugin_id}
        </p>

        <p>
          <strong>Licencias:</strong> {pago.cantidad_licencias}
        </p>

        <p>
          <strong>Estado:</strong>{" "}
          {pago.estado === "pendiente" && (
            <span className="bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300
                             px-2 py-1 rounded text-xs font-semibold">
              Pendiente
            </span>
          )}

          {pago.estado === "validado" && (
            <span className="bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-300
                             px-2 py-1 rounded text-xs font-semibold">
              Validado
            </span>
          )}
        </p>

        <p>
          <strong>Fecha:</strong> {new Date(pago.fecha).toLocaleString()}
        </p>

      </div>
      {/* ACCIONES */}
      <div className="flex flex-col gap-3 max-w-sm">

        {pago.estado !== "validado" && (
          <Tooltip label="Validar pago y crear licencias">
            <button
              onClick={() => setOpen(true)}
              className="btn-primary flex items-center gap-2"
            >
              <CheckCircle size={18} /> Validar pago
            </button>
          </Tooltip>
        )}

      </div>

      {/* CONFIRM DIALOG */}
      <ConfirmDialog
        open={open}
        title="Validar pago"
        description={`¿Deseas validar el pago #${pago.id} y generar las licencias?`}
        confirmText="Validar"
        cancelText="Cancelar"
        onCancel={() => setOpen(false)}
        onConfirm={validarPago}
      />

    </div>
  );
}