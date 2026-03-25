"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CreditCard, Eye } from "lucide-react";

/* Tooltip PRO */
function Tooltip({ label, children }) {
  return (
    <div className="relative group flex items-center">
      {children}
      <div
        className="
          absolute left-1/2 -translate-x-1/2 bottom-full mb-2
          opacity-0 group-hover:opacity-100 transition
          bg-black text-white text-xs py-1 px-2 rounded shadow
          pointer-events-none whitespace-nowrap
        "
      >
        {label}
      </div>
    </div>
  );
}

export default function UserPagosPage() {
  const [pagos, setPagos] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/user/pagos", {
          credentials: "include",
        });

        const data = await res.json();
        setPagos(data.pagos || []);
      } catch (err) {
        console.error("Error cargando pagos:", err);
        setPagos([]);
      }
    }

    load();
  }, []);

  if (pagos === null) return <p>Cargando pagos...</p>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">

      {/* Título */}
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <CreditCard size={30} />
        Mis Pagos
      </h1>

      {/* No hay pagos */}
      {pagos.length === 0 && (
        <p className="text-gray-500">Todavía no tienes pagos registrados.</p>
      )}

      {/* Tabla */}
      <div className="overflow-x-auto rounded shadow-sm">
        <table className="min-w-full border border-gray-300 dark:border-gray-700">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700">
              <th>ID</th>
              <th>Plugin</th>
              <th>Licencias</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {pagos.map((p) => (
              <tr
                key={p.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td>{p.id}</td>
                <td>{p.plugin_id}</td>
                <td>{p.cantidad_licencias}</td>

                {/* Estado con badge PRO */}
                <td>
                  {p.estado === "pendiente" && (
                    <span className="bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 px-2 py-1 rounded text-xs font-semibold">
                      Pendiente
                    </span>
                  )}

                  {p.estado === "validado" && (
                    <span className="bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-300 px-2 py-1 rounded text-xs font-semibold">
                      Validado
                    </span>
                  )}
                </td>

                {/* Fecha */}
                <td>{new Date(p.fecha).toLocaleString()}</td>

                {/* Acciones */}
                <td>
                  <Tooltip label="Ver detalles del pago">
                    <Link
                      href={`/panel/user/pagos/${p.id}`}
                      className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                    >
                      <Eye size={16} /> Ver
                    </Link>
                  </Tooltip>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
}