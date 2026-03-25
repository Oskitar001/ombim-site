"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";

export default function AdminPagoDetallePage({ params }) {
  const { id } = params;
  const [pago, setPago] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const r = await fetch(`/api/admin/pagos/${id}`, { credentials: "include" });
      const d = await r.json();
      setPago(d.pago ?? null);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) return <p>Cargando pago...</p>;
  if (!pago) return <p>Pago no encontrado.</p>;

  const validar = async () => {
    await fetch(`/api/admin/pagos/validar/${pago.id}`, {
      method: "POST",
      credentials: "include",
    });
    window.location.reload();
  };

  return (
    <div className="p-4 space-y-6">
      {/* VOLVER */}
      <Link href="/panel/admin/pagos" className="flex items-center gap-2 text-blue-600 hover:underline">
        <ArrowLeft size={18} /> Volver
      </Link>

      <h2 className="text-2xl font-bold">Pago #{pago.id}</h2>

      {/* CARD INFO */}
      <div className="p-4 rounded bg-gray-200 dark:bg-gray-800 shadow space-y-2">
        <p><strong>Usuario:</strong> {pago.user_email}</p>
        <p><strong>Plugin:</strong> {pago.plugin_id}</p>
        <p><strong>Licencias:</strong> {pago.cantidad_licencias}</p>

        {/* ESTADO */}
        <p>
          <strong>Estado:</strong>{" "}
          {pago.estado === "pendiente" ? (
            <span className="text-yellow-600 font-semibold">Pendiente</span>
          ) : (
            <span className="text-green-600 font-semibold">Validado</span>
          )}
        </p>

        <p><strong>Fecha:</strong> {new Date(pago.fecha).toLocaleString()}</p>
      </div>

      {/* VALIDAR PAGO */}
      {pago.estado !== "validado" && (
        <button
          onClick={validar}
          className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-700"
        >
          <CheckCircle size={18} /> Validar pago
        </button>
      )}

      {/* LICENCIAS */}
      <div className="space-y-3">
        <h3 className="text-xl font-bold mt-6">Licencias generadas</h3>

        {!pago.licencias?.length ? (
          <p>No hay licencias generadas para este pago.</p>
        ) : (
          <ul className="space-y-2">
            {pago.licencias.map((l) => (
              <li key={l.id} className="p-3 bg-gray-200 dark:bg-gray-700 rounded">
                Email Tekla: <strong>{l.email_tekla}</strong> — Estado:{" "}
                <strong>{l.estado}</strong>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}