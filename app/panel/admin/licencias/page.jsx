"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Ticket,
  Eye,
  Calendar,
  Ban,
  CheckCircle,
} from "lucide-react";

export default function AdminLicenciasPage() {
  const [licencias, setLicencias] = useState([]);
  const [maquinas, setMaquinas] = useState({});

  useEffect(() => {
    async function load() {
      const r = await fetch("/api/admin/licencias", {
        credentials: "include",
      });
      const d = await r.json();
      const list = d.licencias ?? [];
      setLicencias(list);

      const maquinasMap = {};

      for (const l of list) {
        const rM = await fetch(
          `/api/admin/licencias/maquinas?id=${l.id}`,
          { credentials: "include" }
        );
        const dM = await rM.json();
        maquinasMap[l.id] = dM.maquinas ?? [];
      }

      setMaquinas(maquinasMap);
    }

    load();
  }, []);

  // ✅ NUEVO: liberar máquina
  async function liberarMaquina(id) {
    await fetch("/api/admin/licencias/maquinas", {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    location.reload(); // recargar rápido
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <Ticket size={28} /> Licencias
      </h1>

      {/* DESKTOP */}
      <div className="overflow-x-auto shadow rounded-xl border">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700 text-sm">
              <th className="p-3">ID</th>
              <th className="p-3">Plugin</th>
              <th className="p-3">Tipo</th>
              <th className="p-3">Estado</th>
              <th className="p-3">Máquinas</th>
              <th className="p-3">Activaciones</th>
              <th className="p-3">Expira</th>
              <th className="p-3"></th>
            </tr>
          </thead>

          <tbody>
            {licencias.map((l) => {
              const maq = maquinas[l.id] ?? [];

              return (
                <tr key={l.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">#{l.id}</td>

                  <td className="p-3">
                    {l.plugins?.nombre ?? l.plugin_id}
                  </td>

                  <td className="p-3">{l.tipo}</td>

                  <td className="p-3">
                    {l.estado === "activa" && (
                      <span className="text-green-600">Activa</span>
                    )}
                    {l.estado === "bloqueada" && (
                      <span className="text-red-600">Bloqueada</span>
                    )}
                  </td>

                  {/* ✅ MÁQUINAS + BOTÓN */}
                  <td className="p-3 text-xs space-y-2">
                    {maq.length === 0 && (
                      <div className="opacity-50">Sin máquinas</div>
                    )}

                    {maq.map((m) => (
                      <div
                        key={m.id}
                        className="flex items-center justify-between gap-2"
                      >
                        <span>{m.maquina_id}</span>

                        {/* 🔥 BOTÓN LIBERAR */}
                        <button
                          onClick={() => liberarMaquina(m.id)}
                          className="text-red-600 hover:text-red-800 text-xs"
                        >
                          liberar
                        </button>
                      </div>
                    ))}
                  </td>

                  <td className="p-3">
                    {maq.length}/{l.max_activaciones}
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
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}