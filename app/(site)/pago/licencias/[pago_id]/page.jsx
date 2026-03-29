"use client";

import { use, useEffect, useState } from "react";

export default function PagosTransferenciaPage({ params }) {
  const { pago_id } = use(params);

  const [pago, setPago] = useState(null);
  const [plugin, setPlugin] = useState(null);
  const [empresa, setEmpresa] = useState(null);

  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const rPago = await fetch(`/api/pagos/detalle/${pago_id}`);
        const dPago = await rPago.json();

        if (!rPago.ok) {
          setError("No se encontró el pago.");
          setLoading(false);
          return;
        }

        setPago(dPago);

        const rPlugin = await fetch(`/api/plugin/${dPago.plugin_id}`);
        setPlugin(await rPlugin.json());

        const rEmpresa = await fetch(`/api/empresa`);
        setEmpresa(await rEmpresa.json());
      } catch {
        setError("Error cargando datos");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [pago_id]);

  async function notificarTransferencia() {
    setMsg("");
    setError("");

    const r = await fetch("/api/pagos/notificar-transferencia", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pago_id }),
    });

    const d = await r.json();

    if (!r.ok) {
      setError(d.error ?? "Error notificando transferencia");
      return;
    }

    setMsg("Tu aviso ha sido enviado. Te confirmaremos en cuanto validemos la transferencia.");
  }

  if (loading) return <p className="p-4">Cargando datos del pago...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;

  const emails = pago.emails ?? [];

  // 👇 VALORES SEGUROS (evitan errores .toFixed)
  const subtotal = pago.importe_base ?? 0;
  const iva = pago.iva ?? 0;
  const total = pago.importe ?? (subtotal + iva);

  const iban = empresa?.iban ?? "—";

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">

      <h2 className="text-2xl font-bold">Pago por transferencia</h2>

      <p className="opacity-80">
        Realiza la transferencia con los datos que aparecen a continuación.
      </p>

      {/* RESUMEN */}
      <div className="border p-4 rounded bg-gray-100 dark:bg-gray-900 space-y-2">
        <h3 className="text-xl font-semibold">Resumen del pedido</h3>

        <p><strong>Plugin:</strong> {plugin?.nombre}</p>
        <p><strong>Tipo de licencia:</strong> {pago.tipo === "anual" ? "Anual" : "Completa"}</p>

        <p><strong>Emails Tekla:</strong></p>
        <ul className="list-disc ml-6">
          {emails.map((e, i) => <li key={i}>{e}</li>)}
        </ul>

        {/* 🟩 DESGLOSE DE IVA */}
        <div className="mt-4 space-y-1">
          <p><strong>Subtotal:</strong> {subtotal.toFixed(2)} €</p>
          <p><strong>IVA (21%):</strong> {iva.toFixed(2)} €</p>
          <p className="text-xl font-bold">
            TOTAL a pagar (IVA incluido): {total.toFixed(2)} €
          </p>
        </div>
      </div>

      {/* DATOS BANCARIOS */}
      <div className="border p-4 rounded bg-gray-100 dark:bg-gray-900 space-y-2">
        <h3 className="text-xl font-semibold">Datos bancarios</h3>

        <p><strong>Titular:</strong> {empresa?.nombre}</p>
        <p><strong>CIF:</strong> {empresa?.cif}</p>
        <p><strong>IBAN:</strong> {iban}</p>
        <p><strong>Concepto:</strong> Pago OMBIM Nº {pago.id}</p>
      </div>

      {msg && <p className="text-green-600 font-semibold">{msg}</p>}
      {error && <p className="text-red-600">{error}</p>}

      <button
        onClick={notificarTransferencia}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
      >
        He realizado la transferencia
      </button>
    </div>
  );
}