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
        // Pago
        const rPago = await fetch(`/api/pagos/detalle/${pago_id}`);
        const dPago = await rPago.json();

        if (!rPago.ok) {
          setError("No se encontró el pago.");
          setLoading(false);
          return;
        }

        setPago(dPago);

        // Plugin
        const rPlugin = await fetch(`/api/plugin/${dPago.plugin_id}`);
        setPlugin(await rPlugin.json());

        // Empresa
        const rEmpresa = await fetch(`/api/empresa`);
        setEmpresa(await rEmpresa.json());
      } catch (err) {
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

  if (loading) return <p className="p-6">Cargando datos del pago...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  const total = pago.importe;
  const emails = pago.emails ?? [];
  const iban = empresa?.iban ?? "—";

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">

      <h1 className="text-3xl font-bold">Pago por transferencia</h1>

      <p className="opacity-80">
        Para completar la compra, realiza una transferencia bancaria con los datos que aparecen a continuación.
      </p>

      <div className="p-4 bg-gray-200 dark:bg-gray-800 rounded-lg space-y-3 shadow">
        <h2 className="text-xl font-bold">Resumen del pedido</h2>

        <p><b>Plugin:</b> {plugin?.nombre}</p>
        <p><b>Tipo de licencia:</b> {pago.tipo === "anual" ? "Anual" : "Completa"}</p>

        <p><b>Emails Tekla:</b></p>
        <ul className="ml-4">
          {emails.map((e, i) => (
            <li key={i}>• {e}</li>
          ))}
        </ul>

        <p className="text-2xl font-bold mt-4">Total a pagar: {total} €</p>
      </div>

      <div className="p-4 bg-gray-200 dark:bg-gray-800 rounded-lg space-y-3 shadow">
        <h2 className="text-xl font-bold">Datos bancarios</h2>

        <p><b>Titular:</b> {empresa?.nombre}</p>
        <p><b>CIF:</b> {empresa?.cif}</p>
        <p><b>IBAN:</b> {iban}</p>
        <p><b>Concepto:</b> Pago OMBIM Nº {pago.id}</p>
      </div>

      {msg && <p className="text-green-600">{msg}</p>}
      {error && <p className="text-red-600">{error}</p>}

      <button
        onClick={notificarTransferencia}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg w-full hover:bg-blue-700"
      >
        He realizado la transferencia
      </button>

      <p className="opacity-60 text-sm text-center">
        Tras revisar la transferencia, se activarán automáticamente tus licencias.
      </p>
    </div>
  );
}