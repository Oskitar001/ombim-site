"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function PagosAdminPage() {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarPagos = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/pagos");
    const data = await res.json();
    setPagos(data || []);
    setLoading(false);
  };

  useEffect(() => {
    cargarPagos();
  }, []);

  const aprobarPago = async (pagoId) => {
    if (!confirm("¿Aprobar este pago y generar licencias?")) return;

    const res = await fetch(`/api/admin/pagos/${pagoId}/aprobar`, {
      method: "POST",
    });

    await res.json();
    await cargarPagos();
  };

  if (loading) return <p>Cargando pagos...</p>;

  return (
    <div className="max-w-4xl mx-auto pt-10">
      <h1 className="text-3xl font-bold mb-6">Pagos pendientes</h1>

      {pagos.length === 0 && <p>No hay pagos pendientes.</p>}

      {pagos.map((pago) => (
        <div key={pago.id} className="border p-4 mb-4 rounded bg-white shadow">
          <p><strong>ID:</strong> {pago.id}</p>
          <p><strong>Usuario:</strong> {pago.user_email}</p>
          <p><strong>Plugin:</strong> {pago.plugin_nombre}</p>
          <p><strong>Emails Tekla:</strong> {pago.emails_tekla?.join(", ") || "—"}</p>
          <p><strong>Estado:</strong> {pago.estado}</p>
          <p><strong>Cantidad:</strong> {pago.cantidad} licencias</p>

          <div className="flex gap-3 mt-3">
            <Link
              href={`/panel/admin/pagos/${pago.id}`}
              className="bg-blue-600 text-white px-3 py-1 rounded"
            >
              Ver detalle
            </Link>

            {pago.estado === "transferencia_notificada" && (
              <button
                className="bg-green-600 text-white px-4 py-2 rounded"
                onClick={() => aprobarPago(pago.id)}
              >
                Aprobar pago
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
