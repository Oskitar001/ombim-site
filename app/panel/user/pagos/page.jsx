"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CreditCard, Eye } from "lucide-react";

/* ------------------------------
   Tooltip PRO (no se toca)
------------------------------ */
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
        const res = await fetch("/api/user/pagos", { credentials: "include" });
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
    <div className="space-y-8 max-w-4xl mx-auto">

      {/* Título */}
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <CreditCard size={30} /> Mis Pagos
      </h1>

      {/* Contenedor premium */}
      <UserSection>
        {/* Sin pagos */}
        {pagos.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400">
            Todavía no tienes pagos registrados.
          </p>
        )}

        {pagos.length > 0 && (
          <div className="overflow-x-auto rounded-xl shadow border border-gray-300 dark:border-gray-700">
            <table className="min-w-full text-left">
              <thead className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wide">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">Plugin</th>
                  <th className="p-3">Lic.</th>
                  <th className="p-3">Estado</th>
                  <th className="p-3">Factura</th>
                  <th className="p-3">Fecha</th>
                  <th className="p-3 text-right"></th>
                </tr>
              </thead>

              <tbody className="text-sm">
                {pagos.map((p) => (
                  <tr
                    key={p.id}
                    className="border-t border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
                  >
                    <td className="p-3 font-semibold">{p.id}</td>
                    <td className="p-3">{p.plugin_id}</td>
                    <td className="p-3">{p.cantidad_licencias}</td>

                    {/* Estado pago */}
                    <td className="p-3">
                      {p.estado === "pendiente" && (
                        <Badge color="yellow">Pendiente</Badge>
                      )}
                      {p.estado === "aprobado" && (
                        <Badge color="green">Aprobado</Badge>
                      )}
                    </td>

                    {/* Estado Factura */}
                    <td className="p-3">
                      {p.numero_factura ? (
                        <Badge color="blue">Lista</Badge>
                      ) : p.factura_solicitada ? (
                        <Badge color="yellow">Solicitada</Badge>
                      ) : (
                        <Badge color="gray">No solicitada</Badge>
                      )}
                    </td>

                    {/* Fecha */}
                    <td className="p-3">
                      {new Date(p.fecha).toLocaleString()}
                    </td>

                    {/* Acciones */}
                    <td className="p-3 text-right">
                      <Tooltip label="Ver detalles del pago">
                        <Link
                          href={`/panel/user/pagos/${p.id}`}
                          className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
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
        )}
      </UserSection>
    </div>
  );
}

/* -----------------------------------------------------
   COMPONENTES PREMIUM REUTILIZABLES
----------------------------------------------------- */

function UserSection({ children }) {
  return (
    <div
      className="
        bg-white dark:bg-gray-900 
        rounded-xl shadow 
        border border-gray-300 dark:border-gray-700
        p-6 space-y-4
      "
    >
      {children}
    </div>
  );
}

function Badge({ children, color }) {
  const colors = {
    yellow:
      "bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    green:
      "bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200",
    blue: "bg-blue-200 text-blue-900 dark:bg-blue-900 dark:text-blue-200",
    gray: "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  };

  return (
    <span
      className={`px-2 py-1 rounded text-xs font-semibold inline-flex items-center gap-1 ${colors[color]}`}
    >
      {children}
    </span>
  );
}