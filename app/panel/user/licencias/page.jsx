"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, Star, Calendar, Ban, Eye, CheckCircle } from "lucide-react";

export default function UserLicenciasPage() {
  const [licencias, setLicencias] = useState(null);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/user/licencias", {
        credentials: "include",
      });
      const data = await res.json();
      setLicencias(data.licencias ?? []);
    }
    load();
  }, []);

  if (licencias === null) {
    return <p className="p-4">Cargando licencias...</p>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">

      <h2 className="text-3xl font-bold">Mis licencias</h2>

      <UserSection title="Listado de licencias">
        {licencias.length === 0 && (
          <p className="text-gray-600 dark:text-gray-400">
            Todavía no tienes licencias.
          </p>
        )}

        {licencias.length > 0 && (
          <div className="overflow-x-auto rounded-xl shadow border border-gray-300 dark:border-gray-700">
            <table className="min-w-full text-left">
              <thead className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wide">
                <tr>
                  <th className="p-3">Plugin</th>
                  <th className="p-3">Tipo</th>
                  <th className="p-3">Estado</th>
                  <th className="p-3">Activaciones</th>
                  <th className="p-3">Expira</th>
                  <th className="p-3 text-right"></th>
                </tr>
              </thead>

              <tbody className="text-sm">
                {licencias.map((l) => (
                  <tr
                    key={l.id}
                    className="border-t border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
                  >
                    {/* ✅ Plugin */}
                    <td className="p-3 font-semibold">
                      {l.plugin_nombre || l.plugin_id}
                    </td>

                    {/* ✅ Tipo */}
                    <td className="p-3">
                      {l.tipo === "trial" && (
                        <Badge color="blue" icon={<Clock size={14} />}>
                          Trial
                        </Badge>
                      )}

                      {l.tipo === "anual" && (
                        <Badge color="yellow" icon={<Calendar size={14} />}>
                          Anual
                        </Badge>
                      )}

                      {l.tipo === "completa" && (
                        <Badge color="purple" icon={<Star size={14} />}>
                          Completa
                        </Badge>
                      )}
                    </td>

                    {/* ✅ Estado */}
                    <td className="p-3">
                      <EstadoBadge estado={l.estado} />
                    </td>

                    {/* ✅ Activaciones */}
                    <td className="p-3">
                      {l.activaciones_usadas}/{l.max_activaciones}
                    </td>

                    {/* ✅ Expiración */}
                    <td className="p-3">
                      {l.fecha_expiracion
                        ? new Date(l.fecha_expiracion).toLocaleDateString()
                        : "—"}
                    </td>

                    {/* ✅ Ver */}
                    <td className="p-3 text-right">
                      <Link
                        href={`/panel/user/licencias/${l.id}`}
                        className="inline-flex items-center gap-1 text-blue-600 hover:underline dark:text-blue-400"
                      >
                        <Eye size={16} /> Ver
                      </Link>
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

/* COMPONENTES */

function UserSection({ title, children }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow border border-gray-300 dark:border-gray-700 p-6 space-y-4">
      {title && (
        <h3 className="text-xl font-bold border-b border-gray-300 dark:border-gray-700 pb-2">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}

function Badge({ color, icon, children }) {
  const colors = {
    blue: "bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    yellow: "bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    purple: "bg-purple-200 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded ${colors[color]}`}>
      {icon} {children}
    </span>
  );
}

function EstadoBadge({ estado }) {
  const styles = {
    activa: "bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200",
    pendiente: "bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    trial: "bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    bloqueada: "bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200",
    expirada: "bg-orange-200 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  };

  const icons = {
    activa: <CheckCircle size={14} />,
    pendiente: <Clock size={14} />,
    trial: <Star size={14} />,
    bloqueada: <Ban size={14} />,
    expirada: <Calendar size={14} />,
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${styles[estado] ?? "bg-gray-200"}`}>
      {icons[estado]} {estado.charAt(0).toUpperCase() + estado.slice(1)}
    </span>
  );
}