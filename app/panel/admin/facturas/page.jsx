"use client";

import { useEffect, useState } from "react";

export default function FacturasPage() {
  const [facturas, setFacturas] = useState([]);

  async function loadFacturas() {
    const res = await fetch("/api/admin/facturas");
    const data = await res.json();
    setFacturas(data.facturas || []);
  }

  useEffect(() => {
    loadFacturas();
  }, []);

  async function duplicarFactura(id) {
    const res = await fetch("/api/admin/facturas/duplicar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      loadFacturas();
      alert("Factura duplicada ✅");
    } else {
      alert("Error duplicando factura");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Facturas</h1>

      <div className="bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-200 dark:bg-gray-800">
            <tr>
              <th className="p-3 text-left">Número</th>
              <th className="p-3 text-left">Cliente</th>
              <th className="p-3 text-left">Fecha</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {facturas.map((f) => (
              <tr key={f.id} className="border-t">
                <td className="p-3">{f.numero}</td>
                <td className="p-3">{f.cliente_nombre}</td>
                <td className="p-3">
                  {new Date(f.fecha).toLocaleDateString()}
                </td>
                <td className="p-3">{Number(f.total).toFixed(2)} €</td>

                <td className="p-3 text-right space-x-2">
                  {/* ✅ DESCARGAR */}
                  <a
                    href={`/api/admin/facturas/pdf?id=${f.id}`}
                    target="_blank"
                    className="bg-blue-600 text-white px-2 py-1 rounded"
                  >
                    PDF
                  </a>

                    <a
                    href={`/panel/admin/facturas/${f.id}`}
                    className="bg-blue-600 text-white px-2 py-1 rounded"
                    >
                    Editar
                    </a>

                  {/* ✅ DUPLICAR */}
                  <button
                    onClick={() => duplicarFactura(f.id)}
                    className="bg-green-600 text-white px-2 py-1 rounded"
                  >
                    Duplicar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {facturas.length === 0 && (
          <p className="p-4 text-gray-500">No hay facturas</p>
        )}
      </div>
    </div>
  );
}