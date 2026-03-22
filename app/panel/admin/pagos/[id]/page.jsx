"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPagoDetallePage({ params }) {
  const { id } = params;
  const router = useRouter();

  const [pago, setPago] = useState(null);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    fetch(`/api/pagos/detalle?pago_id=${id}`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setPago(data);
      });
  }, [id]);

  const aprobar = async () => {
    setError("");
    setMensaje("");

    const res = await fetch("/api/pagos/aprobar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ pago_id: id }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Error al aprobar pago");
      return;
    }

    setMensaje("Pago aprobado y licencias activadas.");
    setTimeout(() => router.push("/panel/admin/pagos"), 1500);
  };

  if (!pago && !error) {
    return <div className="pt-32 px-6">Cargando...</div>;
  }

  if (error) {
    return <div className="pt-32 px-6 text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-3xl mx-auto pt-32 px-6">
      <h1 className="text-2xl font-bold mb-4">Pago {pago.id}</h1>

      <p>
        <strong>Usuario:</strong> {pago.user_id}
      </p>
      <p>
        <strong>Plugin:</strong> {pago.plugin_id}
      </p>
      <p>
        <strong>Licencias:</strong> {pago.cantidad_licencias}
      </p>
      <p>
        <strong>Estado:</strong> {pago.estado}
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Licencias</h2>
      <ul className="space-y-2">
        {pago.licencias?.map((l) => (
          <li key={l.id} className="border p-2 rounded">
            <p>
              <strong>Email Tekla:</strong> {l.email_tekla || "(sin asignar)"}
            </p>
            <p>
              <strong>Estado:</strong> {l.estado}
            </p>
          </li>
        ))}
      </ul>

      <button
        onClick={aprobar}
        className="mt-6 bg-green-600 text-white px-4 py-2 rounded"
      >
        Aprobar pago y activar licencias
      </button>

      {mensaje && <p className="mt-4 text-green-600">{mensaje}</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
}
