"use client";

import { useState } from "react";

export default function PagoClient({ pago }) {
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const solicitarFactura = async () => {
    setMensaje("");
    setError("");

    const res = await fetch("/api/facturacion/solicitar-factura", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pago_id: pago.id }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Error solicitando factura");
      return;
    }

    setMensaje("Factura solicitada correctamente.");
  };

  const descargarFactura = () => {
    window.open(`/api/facturacion/pdf?pago_id=${pago.id}`, "_blank");
  };

  return (
    <div className="space-y-4">

      <div className="border p-4 rounded">
        <p><strong>Plugin:</strong> {pago.plugin_id}</p>
        <p><strong>Importe:</strong> {pago.importe} €</p>
        <p><strong>Estado:</strong> {pago.estado}</p>
        <p><strong>Fecha:</strong> {new Date(pago.created_at).toLocaleString()}</p>
      </div>

      <div className="border p-4 rounded">
        <h3 className="font-semibold mb-2">Licencias</h3>
        {pago.licencias?.length ? (
          <ul className="list-disc ml-6">
            {pago.licencias.map((l) => (
              <li key={l.id}>
                {l.email_tekla || "Sin email asignado"}
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay licencias asociadas.</p>
        )}
      </div>

      {/* Botón para descargar factura */}
      <button
        onClick={descarcarFactura}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Descargar factura en PDF
      </button>

      {/* Botón para solicitar factura (si quieres mantenerlo) */}
      <button
        onClick={solicitarFactura}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Solicitar factura
      </button>

      {mensaje && <p className="text-green-600">{mensaje}</p>}
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
}
