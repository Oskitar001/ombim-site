"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Ticket, Eye, Calendar, KeyRound, Ban, CheckCircle } from "lucide-react";

export default function AdminLicenciasPage() {
  const [licencias, setLicencias] = useState([]);

  useEffect(() => {
    async function load() {
      const r = await fetch("/api/admin/licencias", { credentials: "include" });
      const d = await r.json();
      setLicencias(d.licencias ?? []);
    }
    load();
  }, []);

  return (
    <div className="space-y-6">

      {/* TITULO */}
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <Ticket size={28} /> Licencias
      </h1>

      {/* MOBILE VERSION → CARDS */}
      <div className="grid gap-4 md:hidden">
        {licencias.map((l) => (
          <div
            key={l.id}
            className="p-4 rounded-xl shadow border border-gray-200 dark:border-gray-700 
                       bg-white dark:bg-gray-900 space-y-3"
          >
            <div className="flex justify-between items-center">
              <p className="text-lg font-semibold">{l.email_tekla}</p>
              <Link
                href={`/panel/admin/licencias/${l.id}`}
                className="text-blue-600 flex items-center gap-1"
              >
                <Eye size={16} /> Ver
              </Link>
            </div>

            <div className="text-sm opacity-70">
              Plugin: {l.plugins?.nombre ?? l.plugin_id}
            </div>

            <div className="flex items-center gap-2 text-sm">
              Tipo:
              <span className="font-semibold capitalize">{l.tipo}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              Estado:
              {l.estado === "activa" && (
                <span className="text-green-600 flex items-center gap-1 font-semibold">
                  <CheckCircle size={14} /> Activa
                </span>
              )}
              {l.estado === "bloqueada" && (
                <span className="text-red-600 flex items-center gap-1 font-semibold">
                  <Ban size={14} /> Bloqueada
                </span>
              )}
              {l.estado === "trial" && (
                <span className="text-blue-600 flex items-center gap-1 font-semibold">
                  <KeyRound size={14} /> Trial
                </span>
              )}
            </div>

            <div className="text-sm">
              Activaciones:
              <span className="font-semibold">
                {" "}
                {l.activaciones_usadas}/{l.max_activaciones}
              </span>
            </div>

            <div className="text-sm flex items-center gap-1">
              <Calendar size={14} className="opacity-60" />
              Expira:{" "}
              {l.fecha_expiracion
                ? new Date(l.fecha_expiracion).toLocaleDateString()
                : "—"}
            </div>
          </div>
        ))}
      </div>

      {/* DESKTOP VERSION → TABLE */}
      <div className="hidden md:block overflow-x-auto shadow rounded-xl border border-gray-300 dark:border-gray-700">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700 text-left text-sm uppercase tracking-wide">
              <th className="p-3">Email</th>
              <th className="p-3">Plugin</th>
              <th className="p-3">Tipo</th>
              <th className="p-3">Estado</th>
              <th className="p-3">Activaciones</th>
              <th className="p-3">Expira</th>
              <th className="p-3"></th>
            </tr>
          </thead>

          <tbody className="text-sm">
            {licencias.map((l) => (
              <tr
                key={l.id}
                className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="p-3 font-medium">{l.email_tekla}</td>

                <td className="p-3">{l.plugins?.nombre ?? l.plugin_id}</td>

                <td className="p-3 capitalize">{l.tipo}</td>

                <td className="p-3 capitalize">
                  {l.estado === "activa" && (
                    <span className="text-green-600 font-semibold">Activa</span>
                  )}
                  {l.estado === "bloqueada" && (
                    <span className="text-red-600 font-semibold">Bloqueada</span>
                  )}
                  {l.estado === "trial" && (
                    <span className="text-blue-600 font-semibold">Trial</span>
                  )}
                </td>

                <td className="p-3">
                  {l.activaciones_usadas}/{l.max_activaciones}
                </td>

                <td className="p-3">
                  {l.fecha_expiracion
                    ? new Date(l.fecha_expiracion).toLocaleDateString()
                    : "—"}
                </td>

                <td className="p-3">
                  <Link
                    href={`/panel/admin/licencias/${l.id}`}
                    className="text-blue-600 flex items-center gap-1 font-medium"
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