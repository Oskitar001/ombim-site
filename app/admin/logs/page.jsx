"use client";

import { useEffect, useState } from "react";

export default function LogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [usuarioId, setUsuarioId] = useState(null);

  // Obtener usuarioId desde la URL (solo en cliente)
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("usuario");
    setUsuarioId(id);
  }, []);

  async function cargar() {
    if (!usuarioId) return;

    const res = await fetch(
      `/api/admin/logs?usuario=${usuarioId}&q=${busqueda}`
    );
    const data = await res.json();

    setLogs(data.logs || []);
    setLoading(false);
  }

  useEffect(() => {
    cargar();
  }, [busqueda, usuarioId]);

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">Logs</h1>

      <input
        type="text"
        placeholder="Buscar..."
        className="mb-6 w-full max-w-md p-3 rounded bg-neutral-800 text-white"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      {loading ? (
        <p className="text-neutral-400">Cargando...</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left border-b border-neutral-800">
              <th className="p-3">ID</th>
              <th className="p-3">Acción</th>
              <th className="p-3">Fecha</th>
              <th className="p-3">IP</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-b border-neutral-900">
                <td className="p-3">{log.id}</td>
                <td className="p-3">{log.accion}</td>
                <td className="p-3">{log.fecha}</td>
                <td className="p-3">{log.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
