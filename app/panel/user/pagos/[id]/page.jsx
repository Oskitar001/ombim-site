"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { use as usePromise } from "react";
import { ArrowLeft, FileDown } from "lucide-react";

export default function UserPagoDetallePage({ params }) {
  // Next.js 16 → params es PROMESA
  const { id } = usePromise(params);

  const [pago, setPago] = useState(null);
  const [plugin, setPlugin] = useState(null);
  const [licencias, setLicencias] = useState([]);
  const [facturacion, setFacturacion] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =======================================
  // CARGA
  // =======================================
  useEffect(() => {
    async function load() {
      try {
        // 1) PAGO (CORREGIDO)
        const rPago = await fetch(`/api/pagos/detalle/${id}`, {
          credentials: "include",
        });
        const dPago = await rPago.json();

        if (!rPago.ok) {
          setError(dPago.error ?? "Error cargando pago");
          setLoading(false);
          return;
        }

        setPago(dPago);

        // 2) Plugin
        const rPlugin = await fetch(`/api/plugin/${dPago.plugin_id}`);
        setPlugin(await rPlugin.json());

        // 3) Licencias
        const rLic = await fetch(`/api/user/licencias?pago_id=${id}`);
        const dLic = await rLic.json();
        setLicencias(dLic.licencias ?? []);

        // 4) Facturación
        const rFact = await fetch(`/api/user/facturacion`);
        const dFact = await rFact.json();
        setFacturacion(dFact ?? null);

      } catch (err) {
        setError("Error de conexión");
      } finally {
        setLoading(false);
      }
    }

    if (id) load();
  }, [id]);

  if (loading) return <p className="p-4">Cargando pago…</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;
  if (!pago) return <p className="p-4">Pago no encontrado.</p>;

  // Valores seguros
  const subtotal = pago.importe_base ?? 0;
  const iva = pago.iva ?? 0;
  const total = pago.importe ?? subtotal + iva;

  async function descargarFactura() {
    const res = await fetch("/api/facturacion/pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pagoId: pago.id }),
    });

    if (!res.ok) {
      alert("Error generando factura");
      return;
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `factura-${pago.id}.pdf`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-6">

      <Link href="/panel/user/pagos" className="flex items-center gap-2 text-blue-600 hover:underline">
        <ArrowLeft size={18} />
        Volver
      </Link>

      <h2 className="text-2xl font-bold">Pago #{pago.id}</h2>

      {/* -------------------------------------
          RESUMEN DEL PAGO
      -------------------------------------- */}
      <div className="border p-4 rounded bg-gray-100 dark:bg-gray-900 space-y-1">
        <p><strong>Plugin:</strong> {plugin?.nombre}</p>
        <p><strong>Estado:</strong> {pago.estado}</p>
        <p><strong>Tipo licencia:</strong> {pago.tipo}</p>
        <p><strong>Licencias:</strong> {pago.cantidad_licencias}</p>
        <p>
          <strong>Fecha:</strong>{" "}
          {pago.fecha ? new Date(pago.fecha).toLocaleString() : "—"}
        </p>

        <div className="mt-3">
          <p><strong>Subtotal:</strong> {subtotal.toFixed(2)} €</p>
          <p><strong>IVA 21%:</strong> {iva.toFixed(2)} €</p>
          <p className="text-xl font-bold">
            Total: {total.toFixed(2)} €
          </p>
        </div>

        {/* BOTÓN DESCARGAR FACTURA */}
        {pago.estado === "aprobado" && (
          <button
            onClick={descargarFactura}
            className="mt-4 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            <FileDown size={18} />
            Descargar factura en PDF
          </button>
        )}
      </div>

      {/* -------------------------------------
          LICENCIAS
      -------------------------------------- */}
      <h3 className="text-xl font-bold">Licencias</h3>

      {!licencias.length ? (
        <p>No hay licencias asociadas.</p>
      ) : (
        <ul className="space-y-2">
          {licencias.map((l) => (
            <li key={l.id}>
              <strong>Email Tekla:</strong> {l.email_tekla ?? "—"} —{" "}
              <strong>Estado:</strong> {l.estado}
            </li>
          ))}
        </ul>
      )}

      {/* -------------------------------------
          FACTURACIÓN
      -------------------------------------- */}
      <h3 className="text-xl font-bold mt-6">Datos de facturación</h3>

      {!facturacion ? (
        <p>No hay datos guardados.</p>
      ) : (
        <div className="space-y-1">
          <p><strong>Nombre:</strong> {facturacion.nombre}</p>
          <p><strong>NIF:</strong> {facturacion.nif ?? "—"}</p>
          <p><strong>Dirección:</strong> {facturacion.direccion}</p>
          <p><strong>Ciudad:</strong> {facturacion.ciudad}</p>
          <p><strong>País:</strong> {facturacion.pais}</p>
        </div>
      )}
    </div>
  );
}