"use client";

import { useEffect, useState } from "react";
import ConfirmDialog from "@/components/ConfirmDialog";
import { ArrowLeft, CreditCard } from "lucide-react";
import Link from "next/link";

export default function AdminPagoDetallePage({ params }) {
  const [pago, setPago] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function load() {
      const r = await fetch(`/api/admin/pagos/${params.id}`);
      const d = await r.json();
      setPago(d.pago || null);
    }
    load();
  }, [params.id]);

  if (!pago) return <p>Cargando...</p>;

  async function validarPago() {
    await fetch(`/api/admin/pagos/validar/${pago.id}`, {
      method: "POST",
    });
    setOpen(false);
    window.location.reload();
  }

  return (
    <div className="space-y-6">

      <Link href="/panel/admin/pagos" className="text-blue-600 dark:text-blue-400 flex items-center gap-2">
        <ArrowLeft size={20} /> Volver
      </Link>

      <h1 className="text-3xl font-bold flex items-center gap-2">
        <CreditCard size={28} /> Pago {pago.id}
      </h1>

      <div className="p-6 rounded-lg bg-gray-200 dark:bg-gray-800 shadow space-y-3">
        <p><strong>ID:</strong> {pago.id}</p>
        <p><strong>Usuario:</strong> {pago.user_email}</p>
        <p><strong>Plugin:</strong> {pago.plugin_id}</p>
        <p><strong>Licencias:</strong> {pago.cantidad_licencias}</p>
        <p><strong>Estado:</strong> {pago.estado}</p>
        <p><strong>Fecha:</strong> {new Date(pago.fecha).toLocaleString()}</p>
      </div>

      {pago.estado !== "validado" && (
        <button
          onClick={() => setOpen(true)}
          className="btn-primary flex items-center justify-center gap-2 max-w-xs"
        >
          Validar pago
        </button>
      )}

      <ConfirmDialog
        open={open}
        title="Validar pago"
        description={`¿Validar pago #${pago.id} y crear licencias automáticamente?`}
        confirmText="Validar"
        cancelText="Cancelar"
        onCancel={() => setOpen(false)}
        onConfirm={validarPago}
      />

    </div>
  );
}