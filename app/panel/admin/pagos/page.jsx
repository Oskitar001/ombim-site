"use client";

import { useEffect, useState } from "react";

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
    const res = await fetch(`/api/admin/pagos/${pagoId}/aprobar`, {
      method: "POST",
    });
    await res.json();
    await cargarPagos();
  };

  if (loading) return <p>Cargando pagos...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Pagos pendientes</h1>

      {pagos.length === 0 && <p>No hay pagos.</p>}

      {pagos.map((pago) => (
        <div key={pago.id} className="border p-4 mb-4 rounded bg-white">
          <p><strong>ID:</strong> {pago.id}</p>
          <p><strong>Usuario:</strong> {pago.user_email}</p>
          <p><strong>Plugin:</strong> {pago.plugin_nombre}</p>
          <p><strong>Estado:</strong> {pago.estado}</p>
          <p><strong>Cantidad:</strong> {pago.cantidad} €</p>

          {pago.estado === "pendiente" && (
            <button
              className="mt-2 bg-green-600 text-white px-4 py-2 rounded"
              onClick={() => aprobarPago(pago.id)}
            >
              Aprobar pago y activar licencias
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
