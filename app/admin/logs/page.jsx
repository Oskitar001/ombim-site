// app/admin/logs/page.jsx
"use client";
import { useEffect, useState } from "react";

export default function LogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");

  const usuarioId = new URLSearchParams(window.location.search).get("usuario");

  async function cargar() {
    const res = await fetch(
      `/api/admin/logs?usuario=${usuarioId}&q=${busqueda}`
    );
    const data = await res.json();
    setLogs(data.logs || []);
    setLoading(false);
  }

  async function eliminar(id) {
    if (!confirm("¿Eliminar este log?")) return;

    await fetch("/api/admin/logs/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });

    cargar();
  }

  useEffect(() => {
    cargar();
  }, [busqueda]);

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">Logs</h1>

      <input
        type="text"
        placeholder="Buscar acción..."
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
              <th className="p-3">Hardware ID</th>
              <th className="p-3">Fecha</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((l) => (
              <tr key={l.id} className="border-b border-neutral-900">
                <td className="p-3">{l.id}</td>
                <td className="p-3">{l.accion}</td>
                <td className="p-3">{l.hardware_id}</td>
                <td className="p-3">{l.fecha}</td>
                <td className="p-3">
                  <button
                    onClick={() => eliminar(l.id)}
                    className="text-red-400 hover:underline"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
