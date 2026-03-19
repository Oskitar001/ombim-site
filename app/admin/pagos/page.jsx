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
    const data = await res.json();
    console.log("Aprobar pago:", data);
    await cargarPagos();
  };

  if (loading) return <p>Cargando pagos...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Pagos pendientes</h1>

      {pagos.length === 0 && <p>No hay pagos.</p>}

      {pagos.map((pago) => (
        <div
          key={pago.id}
          style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}
        >
          <p><strong>ID:</strong> {pago.id}</p>
          <p><strong>Usuario:</strong> {pago.user_email}</p>
          <p><strong>Plugin:</strong> {pago.plugin_nombre}</p>
          <p><strong>Estado:</strong> {pago.estado}</p>
          <p><strong>Cantidad:</strong> {pago.cantidad} €</p>

          {pago.estado === "pendiente" && (
            <button onClick={() => aprobarPago(pago.id)}>
              Aprobar pago y activar licencias
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
