"use client";

import { useEffect, useState } from "react";
import ConfirmDialog from "@/components/ConfirmDialog";
import { CreditCard, CheckCircle, Trash2 } from "lucide-react";
import Link from "next/link";

export default function AdminPagosPage() {
  const [pagos, setPagos] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedPago, setSelectedPago] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const r = await fetch("/api/admin/pagos");
    const d = await r.json();
    setPagos(d.pagos || []);
  }

  function confirmarValidacion(pago) {
    setSelectedPago(pago);
    setOpen(true);
  }

  async function validar() {
    await fetch(`/api/admin/pagos/validar/${selectedPago.id}`, {
      method: "POST",
    });
    setOpen(false);
    load();
  }

  return (
    <div className="space-y-6">

      <h1 className="text-3xl font-bold flex items-center gap-2">
        <CreditCard size={28} /> Pagos
      </h1>

      <div className="overflow-x-auto rounded shadow">
        <table className="min-w-full border border-gray-300 dark:border-gray-700">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700 text-left">
              <th>ID</th>
              <th>Usuario</th>
              <th>Plugin</th>
              <th>Licencias</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {pagos.map((p) => (
              <tr
                key={p.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td>{p.id}</td>
                <td>{p.user_email}</td>
                <td>{p.plugin_id}</td>
                <td>{p.cantidad_licencias}</td>
                <td className="capitalize">{p.estado}</td>
                <td>{new Date(p.fecha).toLocaleString()}</td>

                <td>
                  <div className="flex gap-3">

                    {/* VER */}
                    <Link
                      href={`/panel/admin/pagos/${p.id}`}
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Ver
                    </Link>

                    {/* VALIDAR */}
                    {p.estado !== "validado" && (
                      <button
                        onClick={() => confirmarValidacion(p)}
                        className="text-green-600 hover:text-green-800 dark:text-green-400"
                      >
                        <CheckCircle size={18} />
                      </button>
                    )}

                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={open}
        title="Validar pago"
        description={`¿Quieres validar el pago #${selectedPago?.id} y crear las licencias automáticamente?`}
        confirmText="Validar"
        cancelText="Cancelar"
        onCancel={() => setOpen(false)}
        onConfirm={validar}
      />

    </div>
  );
}