"use client";

import { useEffect, useState } from "react";
import {
  Users,
  CreditCard,
  KeyRound,
  Activity,
  ArrowUpRight,
  Download,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalLicencias: 0,
    licenciasActivas: 0,
    licenciasBloqueadas: 0,
    totalPagos: 0,
    pendientes: 0,
    descargasTotales: 0,
    ingresosTotales: 0,
  });

  const [ultimosPagos, setUltimosPagos] = useState([]);
  const [ultimasLicencias, setUltimasLicencias] = useState([]);
  const [ultimosUsuarios, setUltimosUsuarios] = useState([]);

  useEffect(() => {
    async function load() {
      // STATS
      const r1 = await fetch("/api/admin/dashboard");
      const d1 = await r1.json();
      setStats(d1 ?? {});

      // ULTIMOS PAGOS
      const r2 = await fetch("/api/admin/pagos");
      const d2 = await r2.json();
      setUltimosPagos((d2 ?? []).slice(0, 5));

      // ULTIMAS LICENCIAS
      const r3 = await fetch("/api/admin/licencias");
      const d3 = await r3.json();
      setUltimasLicencias((d3?.licencias ?? []).slice(0, 5));

      // ULTIMOS USUARIOS
      const r4 = await fetch("/api/admin/usuarios");
      const d4 = await r4.json();
      setUltimosUsuarios((d4?.users ?? []).slice(0, 5));
    }

    load();
  }, []);

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      {/* TITULO */}
      <h1 className="text-3xl font-bold flex items-center gap-3">
        <Activity size={32} /> Panel de Administración
      </h1>

      {/* AVISO PAGOS PENDIENTES */}
      {stats.pendientes > 0 && (
        <div className="p-4 bg-yellow-200 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-300 rounded-lg shadow font-semibold">
          ⚠️ Tienes {stats.pendientes} pagos pendientes de validar
        </div>
      )}

      {/* TARJETAS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card
          title="Licencias activas"
          value={stats.licenciasActivas}
          icon={<KeyRound size={28} className="text-green-600" />}
        />

        <Card
          title="Pagos totales"
          value={stats.totalPagos}
          icon={<CreditCard size={28} className="text-blue-600" />}
        />

        <Card
          title="Descargas totales"
          value={stats.descargasTotales}
          icon={<Download size={28} className="text-purple-600" />}
        />

        <Card
          title="Ingresos"
          value={`${stats.ingresosTotales}€`}
          icon={<ArrowUpRight size={28} className="text-indigo-600" />}
        />
      </div>

      {/* ULTIMOS PAGOS */}
      <Section title="Últimos pagos">
        {ultimosPagos.map((p) => (
          <Row key={p.id}>
            <div>
              <p className="font-semibold">Pago #{p.id}</p>
              <p className="text-sm opacity-70">
                {p.plugin_id} — {p.estado}
              </p>
            </div>
            <span>{new Date(p.fecha).toLocaleString()}</span>
          </Row>
        ))}
      </Section>

      {/* ULTIMAS LICENCIAS */}
      <Section title="Últimas licencias">
        {ultimasLicencias.map((l) => (
          <Row key={l.id}>
            <div>
              <p className="font-semibold">Licencia #{l.id}</p>
              <p className="text-sm opacity-70">
                {l.plugin_id} — {l.email_tekla}
              </p>
            </div>
            <span>{new Date(l.fecha_creacion).toLocaleString()}</span>
          </Row>
        ))}
      </Section>

      {/* ULTIMOS USUARIOS */}
      <Section title="Últimos usuarios">
        {ultimosUsuarios.map((u) => (
          <Row key={u.id}>
            <p className="font-semibold">{u.email}</p>
            <span>{new Date(u.created_at).toLocaleString()}</span>
          </Row>
        ))}
      </Section>
    </div>
  );
}

// --------- COMPONENTES REUTILIZABLES ---------
function Card({ title, value, icon }) {
  return (
    <div className="p-6 bg-gray-200 dark:bg-gray-800 rounded-lg shadow flex flex-col gap-3">
      <div className="flex items-center gap-3">
        {icon}
        <h2 className="text-lg font-bold">{title}</h2>
      </div>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">{title}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Row({ children }) {
  return <div className="p-4 bg-gray-200 dark:bg-gray-800 rounded shadow flex justify-between">{children}</div>;
}