"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { KeyRound, CheckCircle, Clock, Ban, AlertCircle, Eye } from "lucide-react";

export default function UserLicenciasPage() {
  const [licencias, setLicencias] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar licencias del usuario
  useEffect(() => {
    async function load() {
      const res = await fetch("/api/user/licencias", {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();
      setLicencias(data.licencias || []);
      setLoading(false);
    }

    load();
  }, []);

  if (loading) return <p>Cargando licencias...</p>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">

      {/* TÍTULO */}
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <KeyRound size={30} /> Mis Licencias
      </h1>

      <p className="text-gray-600 dark:text-gray-300">
        Aquí puedes ver todas tus licencias asignadas a emails Tekla, con su estado actual.
      </p>

      {/* TABLA DE LICENCIAS */}
      <div className="overflow-x-auto rounded shadow-sm">
        <table className="min-w-full border border-gray-300 dark:border-gray-700">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700 text-left">
              <th className="border px-3 py-2">Plugin</th>
              <th className="border px-3 py-2">Email Tekla</th>
              <th className="border px-3 py-2">Estado</th>
              <th className="border px-3 py-2">Activaciones</th>
              <th className="border px-3 py-2">Fecha</th>
              <th className="border px-3 py-2">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {licencias.map((l) => (
              <tr 
                key={l.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                {/* Plugin */}
                <td className="border px-3 py-2">{l.plugin_id}</td>

                {/* Email Tekla */}
                <td className="border px-3 py-2">{l.email_tekla}</td>

                {/* Estado */}
                <td className="border px-3 py-2">
                  {l.estado === "activa" && (
                    <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                      <CheckCircle size={18} /> Activa
                    </span>
                  )}

                  {l.estado === "trial" && (
                    <span className="flex items-center gap-1 text-yellow-500 dark:text-yellow-300">
                      <Clock size={18} /> Trial
                    </span>
                  )}

                  {l.estado === "bloqueada" && (
                    <span className="flex items-center gap-1 text-red-600 dark:text-red-300">
                      <Ban size={18} /> Bloqueada
                    </span>
                  )}

                  {l.estado !== "activa" &&
                    l.estado !== "trial" &&
                    l.estado !== "bloqueada" && (
                      <span className="flex items-center gap-1 text-gray-500 dark:text-gray-300">
                        <AlertCircle size={18} /> {l.estado}
                      </span>
                    )}
                </td>

                {/* Activaciones */}
                <td className="border px-3 py-2">
                  {l.activaciones_usadas} / {l.max_activaciones}
                </td>

                {/* Fecha */}
                <td className="border px-3 py-2">
                  {new Date(l.fecha_creacion).toLocaleString()}
                </td>

                {/* Acciones */}
                <td className="border px-3 py-2">
                  <Link
                    href={`/panel/user/licencias/${l.id}`}
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white flex items-center gap-1"
                  >
                    <Eye size={18} /> Ver
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