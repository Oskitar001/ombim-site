"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Ticket, CheckCircle, Ban, RefreshCw, Clock, Eye } from "lucide-react";

export default function AdminLicenciasPage() {
  const [licencias, setLicencias] = useState([]);

  useEffect(() => {
    async function load() {
      const r = await fetch("/api/admin/licencias", {
        credentials: "include",
      });
      const d = await r.json();
      setLicencias(d.licencias ?? []);
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <Ticket size={28} /> Licencias
      </h1>

      <div className="overflow-x-auto shadow rounded">
        <table className="min-w-full border border-gray-300 dark:border-gray-700">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700 text-left">
              <th>ID</th>
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
              <tr
                key={l.id}
                className="border-b border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td>{l.id}</td>
                <td>{l.plugin_id}</td>
                <td>{l.email_tekla}</td>

                {/* ESTADO */}
                <td>
                  {l.estado === "activa" && (
                    <span className="px-2 py-1 bg-green-200 text-green-800 rounded text-xs font-semibold flex items-center gap-1 w-fit">
                      <CheckCircle size={14} /> Activa
                    </span>
                  )}
                  {l.estado === "trial" && (
                    <span className="px-2 py-1 bg-blue-200 text-blue-800 rounded text-xs font-semibold flex items-center gap-1 w-fit">
                      <Clock size={14} /> Trial
                    </span>
                  )}
                  {l.estado === "bloqueada" && (
                    <span className="px-2 py-1 bg-red-200 text-red-800 rounded text-xs font-semibold flex items-center gap-1 w-fit">
                      <Ban size={14} /> Bloqueada
                    </span>
                  )}
                </td>

                <td>
                  {l.activaciones_usadas}/{l.max_activaciones}
                </td>

                <td>{new Date(l.fecha_creacion).toLocaleString()}</td>

                <td>
                  <Link
                    href={`/panel/admin/licencias/${l.id}`}
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <Eye size={16} /> Ver
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}