"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminPagosPage() {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const r = await fetch("/api/admin/pagos/lista");
        const d = await r.json();
        setPagos(d.pagos || []);
      } catch (err) {
        console.log("Error cargando pagos", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p className="p-4">Cargando pagos...</p>;

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Gestión de pagos</h1>

      <div className="rounded border overflow-hidden shadow">
        <table className="w-full text-left">
          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Usuario</th>
              <th className="p-3">Plugin</th>
              <th className="p-3">Licencias</th>
              <th className="p-3">Subtotal</th>
              <th className="p-3">IVA</th>
              <th className="p-3">Total</th>
              <th className="p-3">Estado</th>
              <th className="p-3"></th>
            </tr>
          </thead>

          <tbody>
            {pagos.map((p) => (
              <tr
                key={p.id}
                className="border-t hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                <td className="p-3">{p.id}</td>

                <td className="p-3">{p.user_email}</td>

                <td className="p-3">{p.plugin_nombre}</td>

                <td className="p-3">{p.cantidad_licencias}</td>

                <td className="p-3">{p.importe_base?.toFixed(2)} €</td>

                <td className="p-3">{p.iva?.toFixed(2)} €</td>

                <td className="p-3 font-semibold">{p.importe?.toFixed(2)} €</td>

                <td className="p-3">
                  {p.estado === "pendiente" && (
                    <span className="text-orange-600 font-semibold">
                      Pendiente
                    </span>
                  )}
                  {p.estado === "aprobado" && (
                    <span className="text-green-600 font-semibold">
                      Aprobado
                    </span>
                  )}
                </td>

                <td className="p-3">
                  <Link href={`/panel/admin/pagos/${p.id}`}>
                    Ver →
                  </Link>
                </td>
              </tr>
            ))}

            {pagos.length === 0 && (
              <tr>
                <td colSpan="9" className="p-4 text-center opacity-70">
                  No hay pagos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
