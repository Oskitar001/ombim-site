"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CreditCard, CheckCircle, Eye } from "lucide-react";
import ConfirmDialog from "@/components/ConfirmDialog";

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

      {/* Título */}
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <CreditCard size={28} /> Pagos
      </h1>

      {/* Tabla */}
      <div className="overflow-x-auto rounded shadow">
        <table className="min-w-full border border-gray-300 dark:border-gray-700">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700">
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
              <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">

                <td>{p.id}</td>
                <td>{p.user_email}</td>
                <td>{p.plugin_id}</td>
                <td>{p.cantidad_licencias}</td>

                {/* Badge de estado */}
                <td>
                  {p.estado === "pendiente" && (
                    <span className="bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 px-2 py-1 rounded text-xs font-semibold">
                      Pendiente
                    </span>
                  )}
                  {p.estado === "validado" && (
                    <span className="bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-300 px-2 py-1 rounded text-xs font-semibold">
                      Validado
                    </span>
                  )}
                </td>

                <td>{new Date(p.fecha).toLocaleString()}</td>

                {/* Acciones */}
                <td>
                  <div className="flex gap-4 items-center">

                    {/* Ver */}
                    <Tooltip label="Ver detalle del pago">
                      <Link
                        href={`/panel/admin/pagos/${p.id}`}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800"
                      >
                        <Eye size={18} />
                      </Link>
                    </Tooltip>

                    {/* Validar */}
                    {p.estado !== "validado" && (
                      <Tooltip label="Validar pago y activar licencias">
                        <button
                          onClick={() => confirmarValidacion(p)}
                          className="text-green-600 hover:text-green-800 dark:text-green-400"
                        >
                          <CheckCircle size={18} />
                        </button>
                      </Tooltip>
                    )}

                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={open}
        title="Validar pago"
        description={`¿Validar el pago #${selectedPago?.id} y crear licencias automáticamente?`}
        confirmText="Validar"
        cancelText="Cancelar"
        onCancel={() => setOpen(false)}
        onConfirm={validar}
      />

    </div>
  );
}