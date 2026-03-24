"use client";

import { useEffect, useState } from "react";

export default function AsignarEmailsClient({ pago_id }) {
  const [pago, setPago] = useState(null);
  const [licencias, setLicencias] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/pagos/detalle?pago_id=${pago_id}`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setPago(data);
          setLicencias(
            (data.licencias || []).map((l) => ({
              id: l.id,
              email_tekla: l.email_tekla || "",
            }))
          );
        }
      });
  }, [pago_id]);

  const updateEmail = (i, value) => {
    const copy = [...licencias];
    copy[i].email_tekla = value;
    setLicencias(copy);
  };

  const guardarEmails = async () => {
    setError("");
    setMensaje("");

    const res = await fetch("/api/pagos/guardar-emails", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        pago_id,
        emails: licencias.map((l) => ({
          licencia_id: l.id,
          email_tekla: l.email_tekla,
        })),
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Error al guardar emails");
      return;
    }

    setMensaje("Emails guardados correctamente.");
  };

  const notificarTransferencia = async () => {
    setError("");
    setMensaje("");

    const res = await fetch("/api/pagos/notificar-transferencia", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ pago_id }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Error al notificar transferencia");
      return;
    }

    setMensaje("Transferencia notificada. Revisaremos tu pago en breve.");
  };

  if (!pago && !error) {
    return <div className="pt-32 px-6">Cargando...</div>;
  }

  if (error) {
    return <div className="pt-32 px-6 text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto pt-32 px-6">
      <h1 className="text-2xl font-bold mb-4">Asignar emails de Tekla</h1>

      <p className="mb-4">
        Plugin: <strong>{pago.plugin_id}</strong>
      </p>

      {/* 🔵 DATOS PARA TRANSFERENCIA */}
      <div className="bg-gray-100 p-4 rounded mb-6 border">
        <h2 className="text-xl font-semibold mb-3">Datos para realizar la transferencia</h2>

        <p><strong>Titular:</strong> Oscar Martinez Alonso</p>
        <p><strong>IBAN:</strong> ES72 2100 2737 9002 0006 4372</p>
        <p><strong>BIC/SWIFT:</strong> CAIXESBBXXX</p>
        <p><strong>Concepto:</strong> Pago plugin Tekla – ID: {pago_id}</p>
        <p><strong>Importe:</strong> {pago.importe} €</p>

        <p className="text-sm text-gray-600 mt-3">
          Una vez realizada la transferencia, pulsa el botón “He realizado la transferencia”.
        </p>
      </div>

      {/* 🔵 FORMULARIO DE EMAILS */}
      <div className="space-y-3 mb-6">
        {licencias.map((l, i) => (
          <div key={l.id} className="flex gap-2">
            <input
              type="email"
              value={l.email_tekla}
              onChange={(e) => updateEmail(i, e.target.value)}
              placeholder="Email Tekla"
              className="border p-2 flex-1 rounded"
            />
          </div>
        ))}
      </div>

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
        He realizado la transferencia
      </button>

      {mensaje && <p className="mt-4 text-green-600">{mensaje}</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
}
