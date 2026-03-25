"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CreditCard, CheckCircle, Eye } from "lucide-react";

export default function AdminPagosPage() {
  const [pagos, setPagos] = useState([]);

  useEffect(() => {
    async function load() {
      const r = await fetch("/api/admin/pagos", { credentials: "include" });
      const d = await r.json();
      setPagos(d ?? []);
    }
    load();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Pagos</h2>

      <table className="w-full border border-gray-400">
        <thead>
          <tr className="bg-gray-300 dark:bg-gray-700">
            <th>ID</th>
            <th>Usuario</th>
            <th>Plugin</th>
            <th>Licencias</th>
            <th>Estado</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {pagos.map((p) => (
            <tr key={p.id} className="text-center border-b border-gray-300 dark:border-gray-700">
              <td>{p.id}</td>
              <td>{p.user_email}</td>
              <td>{p.plugin_id}</td>
              <td>{p.cantidad_licencias}</td>

              {/* ESTADO */}
              <td>
                {p.estado === "pendiente" && (
                  <span className="text-yellow-600 font-semibold">Pendiente</span>
                )}
                {p.estado === "validado" && (
                  <span className="text-green-600 font-semibold">Validado</span>
                )}
              </td>

              <td>{new Date(p.fecha).toLocaleString()}</td>

              {/* ACCIONES */}
              <td className="flex justify-center gap-4 py-2">
                <Link href={`/panel/admin/pagos/${p.id}`}>
                  <Eye className="text-blue-600 hover:text-blue-800" />
                </Link>

                {p.estado !== "validado" && (
                  <button
                    onClick={async () => {
                      await fetch(`/api/admin/pagos/validar/${p.id}`, {
                        method: "POST",
                        credentials: "include",
                      });
                      window.location.reload();
                    }}
                  >
                    <CheckCircle className="text-green-600 hover:text-green-800" />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}