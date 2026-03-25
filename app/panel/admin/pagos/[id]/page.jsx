"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import ConfirmDialog from "@/components/ConfirmDialog";
import { ArrowLeft, CreditCard, CheckCircle } from "lucide-react";

/* Tooltip PRO */
function Tooltip({ label, children }) {
  return (
    <span className="relative group">
      {children}
      <span className="absolute hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
        {label}
      </span>
    </span>
  );
}

export default function AdminPagoDetallePage({ params }) {
  const { id } = params;
  const [pago, setPago] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const r = await fetch(`/api/admin/pagos/${id}`, {
          credentials: "include",
        });

        const d = await r.json();

        if (!r.ok) {
          console.error("Error cargando pago:", d.error);
          setPago(null);
          return;
        }

        setPago(d.pago ?? null);
      } catch (err) {
        console.error("Error de conexión:", err);
        setPago(null);
      }
    }
    load();
  }, [id]);

  async function validarPago() {
    await fetch(`/api/admin/pagos/validar/${pago.id}`, {
      method: "POST",
      credentials: "include",
    });

    setOpen(false);
    window.location.reload();
  }

  if (!pago) return <p className="p-4">Cargando pago...</p>;

  return (
    <div className="p-4">
      <Link
        href="/panel/admin/pagos"
        className="flex items-center gap-2 text-blue-600 hover:underline"
      >
        <ArrowLeft size={18} /> Volver
      </Link>

      <h2 className="text-2xl font-bold my-4">Pago #{pago.id}</h2>

      {/* CARD DE INFORMACIÓN DEL PAGO */}
      <p><strong>Usuario:</strong> {pago.user_email}</p>
      <p><strong>Plugin:</strong> {pago.plugin_id}</p>
      <p><strong>Licencias:</strong> {pago.cantidad_licencias}</p>

      <p>
        <strong>Estado:</strong>{" "}
        {pago.estado === "pendiente" && (
          <span className="text-yellow-500">Pendiente</span>
        )}
        {pago.estado === "validado" && (
          <span className="text-green-600">Validado</span>
        )}
      </p>

      <p><strong>Fecha:</strong> {new Date(pago.fecha).toLocaleString()}</p>

      {/* ACCIONES */}
      {pago.estado !== "validado" && (
        <button
          onClick={() => setOpen(true)}
          className="btn-primary flex items-center gap-2 mt-6"
        >
          <CheckCircle size={18} /> Validar pago
        </button>
      )}

      {/* CONFIRM DIALOG */}
      <ConfirmDialog
        open={open}
        onCancel={() => setOpen(false)}
        onConfirm={validarPago}
      />
    </div>
  );
}
