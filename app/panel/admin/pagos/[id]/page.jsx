"use client";

import { useEffect, useState } from "react";

export default function PagoDetalle({ params }) {
  const { id } = params;
  const [pago, setPago] = useState(null);

  async function cargar() {
    const res = await fetch(`/api/admin/pagos/${id}`);
    const data = await res.json();
    setPago(data.pago);
  }

  useEffect(() => {
    cargar();
  }, []);

  if (!pago) return <p>Cargando...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Pago</h2>

      <p><b>Email Tekla:</b> {pago.email_tekla}</p>
      <p><b>Plugin:</b> {pago.plugin_id}</p>
      <p><b>Estado:</b> {pago.estado}</p>
      <p><b>Cantidad:</b> {pago.cantidad || "—"} €</p>
      <p><b>Método:</b> {pago.metodo || "—"}</p>
      <p><b>Referencia:</b> {pago.referencia || "—"}</p>
      <p><b>Fecha:</b> {new Date(pago.fecha).toLocaleString()}</p>
    </div>
  );
}
