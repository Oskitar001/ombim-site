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
          className="bg-white shadow border border-gray-200 rounded p-4 flex justify-between items-center"
        >
          <div>
            <p>
              <span className="font-semibold">Plugin:</span>{" "}
              {pago.plugins?.nombre || pago.plugin_id}
            </p>
            <p>
              <span className="font-semibold">Licencias:</span>{" "}
              {pago.cantidad_licencias}
            </p>
            <p>
              <span className="font-semibold">Estado:</span> {pago.estado}
            </p>
            <p className="text-sm text-gray-500">
              {new Date(pago.fecha).toLocaleString()}
            </p>
          </div>

          <Link
            href={`/panel/mis-pagos/${pago.id}`}
            className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 text-sm"
          >
            Ver detalles
          </Link>
        </div>
      ))}
    </div>
  );
}
