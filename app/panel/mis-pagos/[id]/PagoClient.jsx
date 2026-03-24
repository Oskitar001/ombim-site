// /app/panel/mis-pagos/[id]/PagoClient.jsx
"use client";
import { useEffect, useState } from "react";

export default function PagoClient({ pagoId }) {
  const [pago, setPago] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargar() {
      try {
        const res = await fetch(`/api/pagos/detalle?pago_id=${pagoId}`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.error ?? "Error cargando pago");
          return;
        }

        setPago(data);
      } catch {
        setError("Error de conexión");
      } finally {
        setLoading(false);
      }
    }

    cargar();
  }, [pagoId]);

  if (loading) return <p>Cargando pago…</p>;
  if (error) return <p>{error}</p>;
  if (!pago) return <p>Pago no encontrado.</p>;

  const { licencias = [], facturacion } = pago;

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Detalle del pago</h1>

      <p><strong>ID:</strong> {pago.id}</p>
      <p><strong>Estado:</strong> {pago.estado}</p>
      <p><strong>Cantidad:</strong> {pago.cantidad_licencias}</p>
      {pago.fecha && (
        <p><strong>Fecha:</strong> {new Date(pago.fecha).toLocaleString()}</p>
      )}

      <h3 className="mt-6 font-bold">Licencias</h3>
      {!licencias.length ? (
        <p>No hay licencias asociadas.</p>
      ) : (
        <ul>
          {licencias.map((l) => (
            <li key={l.id}>
              Email Tekla: {l.email_tekla ?? "—"} — Estado: {l.estado}
            </li>
          ))}
        </ul>
      )}

      <h3 className="mt-6 font-bold">Datos de facturación</h3>
      {!facturacion ? (
        <p>No hay datos guardados.</p>
      ) : (
        <div>
          <p><strong>Nombre:</strong> {facturacion.nombre}</p>
          <p><strong>NIF/CIF:</strong> {facturacion.nif ?? "—"}</p>
          <p><strong>Dirección:</strong> {facturacion.direccion}</p>
          <p><strong>Ciudad:</strong> {facturacion.ciudad}</p>
          <p><strong>País:</strong> {facturacion.pais}</p>
        </div>
      )}
    </div>
  );
}