"use client";

import { useEffect, useState } from "react";

export default function LogsAdminPage() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    async function cargar() {
      const res = await fetch("/api/admin/logs-admin");
      const data = await res.json();
      setLogs(data || []);
    }
    cargar();
  }, []);

  return (
    <div className="max-w-4xl mx-auto pt-10">
      <h1 className="text-3xl font-bold mb-6">Logs administrativos</h1>

      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2">Tipo</th>
            <th className="p-2">Mensaje</th>
            <th className="p-2">Usuario</th>
            <th className="p-2">Fecha</th>
          </tr>
        </thead>

        <tbody>
          {logs.map((log) => (
            <tr key={log.id} className="border-t">
              <td className="p-2">{log.tipo}</td>
              <td className="p-2">{log.mensaje}</td>
              <td className="p-2">{log.user_id}</td>
              <td className="p-2">{new Date(log.fecha).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
