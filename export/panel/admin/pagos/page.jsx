"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CreditCard, ArrowRight, CheckCircle, XCircle } from "lucide-react";

export default function AdminPagosPage() {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const r = await fetch("/api/admin/pagos/list", {
          credentials: "include",
        });

        const d = await r.json();
        setPagos(Array.isArray(d) ? d : []);
      } catch (err) {
        console.log("Error cargando pagos", err);
        setPagos([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p className="p-4">Cargando pagos...</p>;

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-8">

      {/* TITULO */}
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <CreditCard size={28} /> Gestión de pagos
      </h1>

      {/* =======================
          MÓVIL → CARDS PREMIUM
      ======================= */}
      <div className="grid gap-4 md:hidden">
        {pagos.map((p) => (
          <div
            key={p.id}
            className="p-4 bg-white dark:bg-gray-900 rounded-xl shadow border border-gray-200 dark:border-gray-700 space-y-3"
          >
            <div className="flex justify-between items-center">
              <p className="font-semibold text-lg">Pago #{p.id}</p>

              <Link
                href={`/panel/admin/pagos/${p.id}`}
                className="text-blue-600 dark:text-blue-400 flex items-center gap-1 font-semibold"
              >
                Ver <ArrowRight size={16} />
              </Link>
            </div>

            <p className="text-sm opacity-70">Usuario: {p.user_email ?? "—"}</p>
            <p className="text-sm opacity-70">
              Plugin: {p.plugin_nombre ?? p.plugin_id}
            </p>

            <div className="flex justify-between text-sm">
              <span>Licencias:</span>
              <span className="font-semibold">{p.cantidad_licencias}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>{p.importe_base?.toFixed(2)} €</span>
            </div>

            <div className="flex justify-between text-sm">
              <span>IVA:</span>
              <span>{p.iva?.toFixed(2)} €</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="font-medium">Total:</span>
              <span className="font-bold text-green-600 dark:text-green-400">
                {p.importe?.toFixed(2)} €
              </span>
            </div>

            {/* ESTADO */}
            <div>
              {p.estado === "pendiente" && (
                <span className="px-3 py-1 text-xs rounded-lg bg-orange-200 text-orange-800 font-semibold inline-flex items-center gap-1">
                  <XCircle size={14} /> Pendiente
                </span>
              )}

              {p.estado === "aprobado" && (
                <span className="px-3 py-1 text-xs rounded-lg bg-green-200 text-green-800 font-semibold inline-flex items-center gap-1">
                  <CheckCircle size={14} /> Aprobado
                </span>
              )}
            </div>
          </div>
        ))}

        {pagos.length === 0 && (
          <p className="text-center opacity-70">No hay pagos registrados.</p>
        )}
      </div>

      {/* ===========================
          ESCRITORIO → TABLA PREMIUM
      =========================== */}
      <div className="hidden md:block rounded-xl border border-gray-300 dark:border-gray-700 shadow overflow-hidden">
        <table className="min-w-full text-left">
          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wide">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Usuario</th>
              <th className="p-3">Plugin</th>
              <th className="p-3">Licencias</th>
              <th className="p-3">Subtotal</th>
              <th className="p-3">IVA</th>
              <th className="p-3">Total</th>
              <th className="p-3">Estado</th>
              <th className="p-3"></th>
            </tr>
          </thead>

          <tbody className="text-sm">
            {pagos.map((p) => (
              <tr
                key={p.id}
                className="border-t border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition"
              >
                <td className="p-3 font-semibold">{p.id}</td>
                <td className="p-3">{p.user_email ?? "—"}</td>
                <td className="p-3">{p.plugin_nombre ?? p.plugin_id}</td>
                <td className="p-3">{p.cantidad_licencias}</td>

                <td className="p-3">{p.importe_base?.toFixed(2)} €</td>
                <td className="p-3">{p.iva?.toFixed(2)} €</td>

                <td className="p-3 font-bold text-green-600 dark:text-green-400">
                  {p.importe?.toFixed(2)} €
                </td>

                <td className="p-3">
                  {p.estado === "pendiente" && (
                    <span className="px-3 py-1 text-xs rounded-lg bg-orange-200 text-orange-800 font-semibold">
                      Pendiente
                    </span>
                  )}

                  {p.estado === "aprobado" && (
                    <span className="px-3 py-1 text-xs rounded-lg bg-green-200 text-green-800 font-semibold">
                      Aprobado
                    </span>
                  )}
                </td>

                <td className="p-3">
                  <Link
                    href={`/panel/admin/pagos/${p.id}`}
                    className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                  >
                    Ver →
                  </Link>
                </td>
              </tr>
            ))}

            {pagos.length === 0 && (
              <tr>
                <td colSpan="9" className="p-4 text-center opacity-70">
                  No hay pagos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
