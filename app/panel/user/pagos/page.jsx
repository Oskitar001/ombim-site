"use client";

import { useEffect, useState } from "react";
import { CreditCard, Eye } from "lucide-react";
import Link from "next/link";

export default function PagosUserPage() {
  const [pagos, setPagos] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/user/pagos", { credentials: "include" });
      const data = await res.json();
      setPagos(data.pagos || []);
    }
    load();
  }, []);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">

      <h1 className="text-3xl font-bold flex items-center gap-2">
        <CreditCard size={28} /> Mis Pagos
      </h1>

      <div className="overflow-x-auto rounded shadow-sm">
        <table className="min-w-full border border-gray-300 dark:border-gray-700">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700 text-left">
              <th className="border px-3 py-2">ID</th>
              <th className="border px-3 py-2">Plugin</th>
              <th className="border px-3 py-2">Licencias</th>
              <th className="border px-3 py-2">Estado</th>
              <th className="border px-3 py-2">Fecha</th>
              <th className="border px-3 py-2">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {pagos.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="border px-3 py-2">{p.id}</td>
                <td className="border px-3 py-2">{p.plugin_id}</td>
                <td className="border px-3 py-2">{p.cantidad_licencias}</td>
                <td className="border px-3 py-2 capitalize">{p.estado}</td>
                <td className="border px-3 py-2">{new Date(p.fecha).toLocaleString()}</td>
                <td className="border px-3 py-2">
                  <Link
                    href={`/panel/user/pagos/${p.id}`}
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