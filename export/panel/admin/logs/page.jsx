"use client";

import { useEffect, useState } from "react";
import { FileText, Clock } from "lucide-react";

export default function AdminLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const r = await fetch("/api/admin/logs", {
          credentials: "include",
        });

        const d = await r.json();
        setLogs(Array.isArray(d.logs) ? d.logs : []);
      } catch (err) {
        console.error("Error cargando logs:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) return <p className="p-4">Cargando logs...</p>;

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-10">

      {/* TÍTULO */}
      <h1 className="text-3xl font-bold flex items-center gap-3">
        <FileText size={30} /> Registros del sistema
      </h1>

      {/* DESCRIPCIÓN */}
      <p className="opacity-75">
        Aquí se muestran las actividades importantes del sistema: activaciones, pagos, errores, etc.
      </p>

      {/* ============================
            MÓVIL → CARDS PREMIUM
      ============================ */}
      <div className="grid gap-4 md:hidden">
        {logs.map((l) => (
          <div
            key={l.id}
            className="p-4 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl shadow space-y-2"
          >
            <p className="font-semibold text-lg">{l.accion}</p>

            <p className="text-sm opacity-80">{l.descripcion}</p>

            <p className="flex items-center gap-2 text-sm opacity-70">
              <Clock size={16} /> {new Date(l.fecha).toLocaleString()}
            </p>

            {l.extra && (
              <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs overflow-x-auto">
                {JSON.stringify(l.extra, null, 2)}
              </pre>
            )}
          </div>
        ))}

        {logs.length === 0 && (
          <p className="text-center opacity-70">No hay registros.</p>
        )}
      </div>

      {/* ============================
            DESKTOP → TABLA PREMIUM
      ============================ */}
      <div className="hidden md:block rounded-xl border border-gray-300 dark:border-gray-700 shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wide">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Acción</th>
              <th className="p-3">Descripción</th>
              <th className="p-3">Extra</th>
              <th className="p-3">Fecha</th>
            </tr>
          </thead>

          <tbody className="text-sm">
            {logs.map((l) => (
              <tr
                key={l.id}
                className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                <td className="p-3">{l.id}</td>

                <td className="p-3 font-semibold">{l.accion}</td>

                <td className="p-3">{l.descripcion}</td>

                <td className="p-3">
                  {l.extra ? (
                    <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs overflow-x-auto max-w-xs">
                      {JSON.stringify(l.extra, null, 2)}
                    </pre>
                  ) : (
                    "—"
                  )}
                </td>

                <td className="p-3">
                  {new Date(l.fecha).toLocaleString()}
                </td>
              </tr>
            ))}

            {logs.length === 0 && (
              <tr>
                <td colSpan="5" className="p-4 text-center opacity-70">
                  No hay registros disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}