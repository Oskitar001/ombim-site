// /app/panel/mis-pagos/PagosClient.jsx
"use client";
import Link from "next/link";

export default function PagosClient({ pagos }) {
  if (!pagos.length) return <p>No tienes pagos registrados.</p>;

  return (
    <div className="space-y-4">
      {pagos.map((pago) => (
        <div key={pago.id} className="border p-4 rounded">
          <p><strong>Plugin:</strong> {pago.plugins?.nombre ?? pago.plugin_id}</p>
          <p><strong>Licencias:</strong> {pago.cantidad_licencias}</p>
          <p><strong>Estado:</strong> {pago.estado}</p>
          <p>{new Date(pago.fecha).toLocaleString()}</p>

          <Link
            href={`/panel/mis-pagos/${pago.id}`}
            className="underline text-blue-600"
          >
            Ver detalles
          </Link>
        </div>
      ))}
    </div>
  );
}