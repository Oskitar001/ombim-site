"use client";

import { useState, useEffect } from "react";

export default function VerLog({ params }) {
  const id = params.id;

  const [log, setLog] = useState(null);

  useEffect(() => {
    fetch(`/api/admin/logs/${id}`)
      .then((res) => res.json())
      .then((data) => setLog(data));
  }, [id]);

  async function eliminar() {
    if (!confirm("¿Eliminar este log?")) return;

    await fetch(`/api/admin/logs/${id}`, { method: "DELETE" });

    window.location.href = "/admin/logs";
  }

  if (!log) return <p>Cargando...</p>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Detalle del log</h1>

      <div className="bg-white p-6 rounded shadow">
        <p><strong>ID:</strong> {log.id}</p>
        <p><strong>Empresa:</strong> {log.empresa_id || "-"}</p>
        <p><strong>Empleado:</strong> {log.empleado_id || "-"}</p>
        <p><strong>Acción:</strong> {log.accion}</p>
        <p><strong>Fecha:</strong> {new Date(log.fecha).toLocaleString()}</p>
        <p><strong>Datos:</strong></p>
        <pre className="bg-gray-100 p-4 rounded mt-2">
{JSON.stringify(log.datos, null, 2)}
        </pre>

        <button
          onClick={eliminar}
          className="mt-6 px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Eliminar log
        </button>
      </div>
    </div>
  );
}
