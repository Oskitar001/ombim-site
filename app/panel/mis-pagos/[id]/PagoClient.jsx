"use client";

import { useEffect, useState } from "react";

export default function PagoClient({ pagoId }) {
  const [pago, setPago] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await fetch(`/api/pagos/detalle?pago_id=${pagoId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setError(data.error || "Error cargando el pago");
          setLoading(false);
          return;
        }

        const data = await res.json();
        setPago(data);
      } catch (e) {
        setError("Error de conexión");
      } finally {
        setLoading(false);
      }
    };

    if (pagoId) cargar();
  }, [pagoId]);

  if (loading) return <div className="p-4">Cargando pago...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!pago) return <div className="p-4">Pago no encontrado.</div>;

  const { licencias = [], facturacion } = pago;

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">Detalle del pago</h1>

      <div className="border rounded-lg p-3">
        <p><strong>ID:</strong> {pago.id}</p>
        <p><strong>Estado:</strong> {pago.estado}</p>
        <p><strong>Cantidad de licencias:</strong> {pago.cantidad_licencias}</p>
        {pago.fecha && (
          <p>
            <strong>Fecha:</strong>{" "}
            {new Date(pago.fecha).toLocaleString()}
          </p>
        )}
      </div>

      <div className="border rounded-lg p-3">
        <h2 className="font-semibold mb-2">Licencias</h2>
        {licencias.length === 0 ? (
          <p>No hay licencias asociadas.</p>
        ) : (
          <ul className="space-y-1">
            {licencias.map((l) => (
              <li key={l.id} className="border-b pb-1 last:border-b-0">
                <div><strong>Email Tekla:</strong> {l.email_tekla || "—"}</div>
                <div><strong>Estado:</strong> {l.estado}</div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="border rounded-lg p-3">
        <h2 className="font-semibold mb-2">Datos de facturación</h2>
        {!facturacion ? (
          <p>No hay datos de facturación guardados.</p>
        ) : (
          <div className="space-y-1">
            <p><strong>Nombre:</strong> {facturacion.nombre || "—"}</p>
            <p><strong>NIF/CIF:</strong> {facturacion.nif || "—"}</p>
            <p><strong>Dirección:</strong> {facturacion.direccion || "—"}</p>
            <p><strong>Ciudad:</strong> {facturacion.ciudad || "—"}</p>
            <p><strong>País:</strong> {facturacion.pais || "—"}</p>
          </div>
        )}
      </div>
    </div>
  );
}
