"use client";

import { useEffect, useState } from "react";

export default function PaginaLicencias({ params }) {
  // Next.js 15 → params es un Promise
  const [pagoId, setPagoId] = useState(null);
  const [cantidad, setCantidad] = useState(0);
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);

  // Resolver params
  useEffect(() => {
    async function resolver() {
      const resolved = await params;
      setPagoId(resolved.pago_id);
    }
    resolver();
  }, [params]);

  // Cargar datos del pago
  useEffect(() => {
    if (!pagoId) return;

    async function cargar() {
      const res = await fetch(`/api/pagos/detalle?pago_id=${pagoId}`, {
        cache: "no-store",
        credentials: "include"
      });

      if (!res.ok) {
        setLoading(false);
        return;
      }

      const data = await res.json();

      // data.pago.cantidad → correcto
      const cant = data?.pago?.cantidad || 0;

      setCantidad(cant);
      setEmails(Array(cant).fill(""));
      setLoading(false);
    }

    cargar();
  }, [pagoId]);

  const actualizarEmail = (i, valor) => {
    const copia = [...emails];
    copia[i] = valor;
    setEmails(copia);
  };

  async function guardarEmails() {
    if (emails.some((e) => !e.trim())) {
      alert("Todos los emails son obligatorios.");
      return;
    }

    if (new Set(emails).size !== emails.length) {
      alert("No puede haber emails duplicados.");
      return;
    }

    await fetch("/api/pagos/guardar-emails", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ pago_id: pagoId, emails }),
    });

    alert("Emails guardados");
  }

  async function notificarTransferencia() {
    await fetch("/api/pagos/notificar-transferencia", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ pago_id: pagoId }),
    });
    alert("Transferencia notificada");
  }

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="max-w-3xl mx-auto pt-20 px-6">
      <h1 className="text-3xl font-bold mb-6">Asignar emails de Tekla</h1>

      {Array.from({ length: cantidad }).map((_, i) => (
        <div key={i} className="border p-4 rounded mb-3">
          <p className="font-semibold">Licencia #{i + 1}</p>
          <input
            type="email"
            className="border px-3 py-2 rounded w-full mt-2"
            placeholder="email@tekla.com"
            value={emails[i]}
            onChange={(e) => actualizarEmail(i, e.target.value)}
          />
        </div>
      ))}

      <button
        onClick={guardarEmails}
        className="bg-blue-600 text-white px-4 py-2 rounded mr-3"
      >
        Guardar emails
      </button>

      <button
        onClick={notificarTransferencia}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        He hecho la transferencia
      </button>
    </div>
  );
}
