"use client";

import { useEffect, useState } from "react";

export default function LogsPage() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    async function cargar() {
      const res = await fetch("/api/admin/logs");
      const data = await res.json();
      setLogs(data || []);
    }
    cargar();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Logs de uso</h1>

      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2">ID</th>
            <th className="p-2">Clave</th>
            <th className="p-2">IP</th>
            <th className="p-2">User Agent</th>
            <th className="p-2">Fecha</th>
          </tr>
        </thead>

        <tbody>
          {logs.map((log) => (
            <tr key={log.id} className="border-t">
              <td className="p-2">{log.id}</td>
              <td className="p-2">{log.clave}</td>
              <td className="p-2">{log.ip}</td>
              <td className="p-2">{log.user_agent}</td>
              <td className="p-2">{new Date(log.fecha).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
