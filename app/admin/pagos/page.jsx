"use client";

import { useEffect, useState } from "react";

export default function PagosPage() {
  const [pagos, setPagos] = useState([]);
  const [q, setQ] = useState("");

  async function cargar() {
    const res = await fetch(`/api/admin/pagos?q=${q}`);
    const data = await res.json();
    setPagos(data.pagos || []);
  }

  useEffect(() => {
    cargar();
  }, [q]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Pagos</h2>

      <input
        className="border p-2 mb-4"
        placeholder="Buscar por email o plugin..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2">Email Tekla</th>
            <th className="p-2">Plugin</th>
            <th className="p-2">Estado</th>
            <th className="p-2">Cantidad</th>
            <th className="p-2">Fecha</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {pagos.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="p-2">{p.email_tekla}</td>
              <td className="p-2">{p.plugin_id}</td>
              <td className="p-2">{p.estado}</td>
              <td className="p-2">{p.cantidad || "—"}</td>
              <td className="p-2">{new Date(p.fecha).toLocaleString()}</td>
              <td className="p-2">
                <a
                  href={`/admin/pagos/${p.id}`}
                  className="text-blue-600 underline"
                >
                  Ver
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
