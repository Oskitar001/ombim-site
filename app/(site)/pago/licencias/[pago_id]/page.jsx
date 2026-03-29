"use client";

import { use, useEffect, useState } from "react";
import AsignarEmailsClient from "./AsignarEmailsClient";

export default function LicenciasPagoPage({ params }) {
  // ✔ FIX: params es Promesa en Next.js 15/16
  const { pago_id } = use(params);

  const [pago, setPago] = useState(null);
  const [plugin, setPlugin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        // 1. Cargar datos del pago
        const rPago = await fetch(`/api/pagos/detalle/${pago_id}`);
        const dPago = await rPago.json();

        if (dPago?.error) {
          setError("No se encontró el pago");
          setLoading(false);
          return;
        }

        setPago(dPago);

        // 2. Cargar datos del plugin
        const rPlugin = await fetch(`/api/plugin/${dPago.plugin_id}`);
        const dPlugin = await rPlugin.json();

        if (dPlugin?.error) {
          setError("No se encontró el plugin asociado");
          setLoading(false);
          return;
        }

        setPlugin(dPlugin);
      } catch {
        setError("Error cargando datos");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [pago_id]);

  if (loading) return <p className="p-4">Cargando...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;

  // ================================================
  // ⭐ CÁLCULO CORRECTO DEL PRECIO (SOLO ANUAL/COMPLETA)
  // ================================================
  const tipo = pago.tipo; // "anual" | "completa"

  const precioAnual = Number(plugin.precio_anual) || 0;
  const precioCompleta =
    Number(plugin.precio_completa) > 0
      ? Number(plugin.precio_completa)
      : Number(plugin.precio) || 0;

  const precioUnitario = tipo === "anual" ? precioAnual : precioCompleta;

  const total = precioUnitario * pago.cantidad_licencias;

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-6">

      <h1 className="text-2xl font-bold">Licencias del pago #{pago_id}</h1>

      <div className="border rounded p-4 space-y-2">
        <p>
          <strong>Plugin:</strong> {plugin.nombre}
        </p>

        <p>
          <strong>Tipo de licencia:</strong>{" "}
          {tipo === "anual" ? "Anual" : "Completa"}
        </p>

        <p>
          <strong>Precio por licencia:</strong> {precioUnitario} €
        </p>

        <p>
          <strong>Cantidad de licencias:</strong> {pago.cantidad_licencias}
        </p>

        <p>
          <strong>Total:</strong> {total} €
        </p>
      </div>

      <AsignarEmailsClient pago_id={pago_id} />
    </div>
  );
}