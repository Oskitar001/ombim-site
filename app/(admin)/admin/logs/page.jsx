"use client";

import { useEffect, useState } from "react";

export default function LogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/admin/logs");
      const data = await res.json();
      setLogs(data.logs || []);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Logs del sistema</h1>

      {loading ? (
        <p>Cargando...</p>
      ) : logs.length === 0 ? (
        <p>No hay logs registrados.</p>
      ) : (
        <ul className="space-y-3">
          {logs.map((l) => (
            <li key={l.id} className="border p-4 rounded-lg">
              <p><strong>ID:</strong> {l.id}</p>
              <p><strong>Usuario:</strong> {l.usuario_id}</p>
              <p><strong>Acción:</strong> {l.accion}</p>
              <p><strong>Hardware:</strong> {l.hardware_id}</p>
              <p><strong>Fecha:</strong> {l.fecha}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
