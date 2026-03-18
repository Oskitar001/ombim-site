"use client";

import { useEffect, useState } from "react";
import StatsCard from "@/components/admin/StatsCard";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);

  async function cargar() {
    const res = await fetch("/api/admin/dashboard");
    const data = await res.json();
    setStats(data);
  }

  useEffect(() => {
    cargar();
  }, []);

  if (!stats) return <p>Cargando...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatsCard title="Licencias totales" value={stats.totalLicencias} />
        <StatsCard title="Licencias activas" value={stats.licenciasActivas} />
        <StatsCard title="Licencias bloqueadas" value={stats.licenciasBloqueadas} />
        <StatsCard title="Activaciones totales" value={stats.activacionesTotales} />
        <StatsCard title="Pagos totales" value={stats.totalPagos} />
        <StatsCard title="Ingresos totales (€)" value={stats.ingresosTotales} />
      </div>

      <h3 className="text-xl font-bold mb-2">Últimos pagos</h3>
      <ul className="mb-6">
        {stats.ultimosPagos.map((p) => (
          <li key={p.id}>
            {p.email_tekla} — {p.cantidad}€ — {new Date(p.fecha).toLocaleString()}
          </li>
        ))}
      </ul>

      <h3 className="text-xl font-bold mb-2">Últimas licencias creadas</h3>
      <ul>
        {stats.ultimasLicencias.map((l) => (
          <li key={l.id}>
            {l.email_tekla} — {l.plugin_id} — {new Date(l.fecha_creacion).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
