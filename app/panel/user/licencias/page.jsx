"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { KeyRound, CheckCircle, Clock, Ban, Eye } from "lucide-react";

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

export default function UserLicenciasPage() {
  const [licencias, setLicencias] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/user/licencias", {
          credentials: "include",
        });

        const data = await res.json();
        setLicencias(data.licencias || []);
      } catch (err) {
        console.error("Error cargando licencias:", err);
        setLicencias([]);
      }
    }

    load();
  }, []);

  if (licencias === null) {
    return <p>Cargando licencias...</p>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">

      {/* TÍTULO */}
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <KeyRound size={30} /> Mis Licencias
      </h1>

      {/* SIN LICENCIAS */}
      {licencias.length === 0 && (
        <p className="text-gray-500">Aún no tienes licencias activas.</p>
      )}

      {/* TABLA */}
      <div className="overflow-x-auto rounded shadow-sm">
        <table className="min-w-full border border-gray-300 dark:border-gray-700">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700">
              <th>Plugin</th>
              <th>Email Tekla</th>
              <th>Estado</th>
              <th>Activaciones</th>
              <th>Fecha</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {licencias.map((l) => (
              <tr key={l.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">

                {/* PLUGIN */}
                <td>{l.plugin_id}</td>

                {/* EMAIL TEKLA */}
                <td>{l.email_tekla}</td>

                {/* ESTADO */}
                <td>
                  {l.estado === "activa" && (
                    <span className="bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-300 px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
                      <CheckCircle size={14} /> Activa
                    </span>
                  )}

                  {l.estado === "trial" && (
                    <span className="bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
                      <Clock size={14} /> Trial
                    </span>
                  )}

                  {l.estado === "bloqueada" && (
                    <span className="bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-300 px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
                      <Ban size={14} /> Bloqueada
                    </span>
                  )}
                </td>

                {/* ACTIVACIONES */}
                <td>
                  {l.activaciones_usadas} / {l.max_activaciones}
                </td>

                {/* FECHA */}
                <td>{new Date(l.fecha_creacion).toLocaleString()}</td>

                {/* ACCIONES */}
                <td>
                  <Tooltip label="Ver detalles de la licencia">
                    <Link
                      href={`/panel/user/licencias/${l.id}`}
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