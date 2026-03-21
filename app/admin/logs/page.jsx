// ======================================================
// PÁGINA LOGS - app/admin/logs/page.jsx
// ======================================================
"use client";
import { useEffect, useState } from "react";

export default function AdminLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/logs/list")
      .then((res) => res.json())
      .then((data) => {
        setLogs(data.logs || []);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-10">Cargando logs...</div>;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Logs del Sistema</h1>
      <div className="space-y-2 text-sm font-mono bg-black text-green-300 p-4 rounded">
        {logs.map((log) => (
          <div key={log.id} className="border-b border-green-800 pb-1 mb-1">
            <span className="text-xs text-gray-400">
              [{log.created_at ? new Date(log.created_at).toLocaleString() : "—"}]
            </span>{" "}
            <span className="font-bold">({log.level})</span>{" "}
            <span>{log.message}</span>
            {log.context && (
              <div className="text-xs text-gray-400">
                {typeof log.context === "string"
                  ? log.context
                  : JSON.stringify(log.context)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}