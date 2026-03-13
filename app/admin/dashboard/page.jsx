// app/admin/dashboard/page.jsx
"use client";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  async function cargar() {
    const res = await fetch("/api/admin/stats");
    const data = await res.json();
    setStats(data);
    setLoading(false);
  }

  useEffect(() => {
    cargar();
  }, []);

  if (loading || !stats) {
    return <p className="text-neutral-400">Cargando estadísticas...</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-200 border border-neutral-800 rounded-xl p-5">
          <p className="text-neutral-400 text-sm">Usuarios totales</p>
          <p className="text-3xl font-bold mt-2">{stats.usuarios_totales}</p>
        </div>

        <div className="bg-gray-200 border border-neutral-800 rounded-xl p-5">
          <p className="text-neutral-400 text-sm">Usuarios activos</p>
          <p className="text-3xl font-bold mt-2 text-green-400">
            {stats.usuarios_activos}
          </p>
        </div>

        <div className="bg-gray-200 border border-neutral-800 rounded-xl p-5">
          <p className="text-neutral-400 text-sm">Usuarios suspendidos</p>
          <p className="text-3xl font-bold mt-2 text-red-400">
            {stats.usuarios_suspendidos}
          </p>
        </div>

        <div className="bg-gray-200 border border-neutral-800 rounded-xl p-5">
          <p className="text-neutral-400 text-sm">Dispositivos totales</p>
          <p className="text-3xl font-bold mt-2">
            {stats.dispositivos_totales}
          </p>
        </div>

        <div className="bg-gray-200 border border-neutral-800 rounded-xl p-5">
          <p className="text-neutral-400 text-sm">Logs totales</p>
          <p className="text-3xl font-bold mt-2">{stats.logs_totales}</p>
        </div>
      </div>
    </div>
  );
}
