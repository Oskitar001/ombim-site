"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";

export default function AdminPagoDetallePage({ params }) {
  const { id } = use(params);

  const [pago, setPago] = useState(null);
  const [facturacion, setFacturacion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const r = await fetch(`/api/admin/pagos/detalle/${id}`, {
        credentials: "include"
      });

      const data = await r.json();

      setPago(data?.pago ?? null);
      setFacturacion(data?.facturacion ?? null);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) return <p>Cargando…</p>;
  if (!pago) return <p>Pago no encontrado.</p>;

  return (
    <div>
      <Link href="/panel/admin/pagos">← Volver</Link>

      <h2>Pago #{pago.id}</h2>

      <pre>{JSON.stringify(pago, null, 2)}</pre>

      <h3>Facturación</h3>
      <pre>{JSON.stringify(facturacion, null, 2)}</pre>
    </div>
  );
}
