"use client";

import Link from "next/link";

export default function PagosClient({ pagos }) {
  if (!pagos.length) {
    return <p>No tienes pagos registrados.</p>;
  }

  return (
    <div className="space-y-4">
      {pagos.map((pago) => (
        <div
          key={pago.id}
          className="border p-4 rounded flex justify-between items-center"
        >
          <div>
            <p><strong>Plugin:</strong> {pago.plugin_id}</p>
            <p><strong>Importe:</strong> {pago.importe} €</p>
            <p><strong>Estado:</strong> {pago.estado}</p>
            <p className="text-sm text-gray-500">
              {new Date(pago.created_at).toLocaleString()}
            </p>
          </div>

          <Link
            href={`/panel/mis-pagos/${pago.id}`}
            className="bg-blue-600 text-white px-3 py-2 rounded"
          >
            Ver detalles
          </Link>
        </div>
      ))}
    </div>
  );
}
