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
      /* =====================================
         1. STATS DASHBOARD
      ===================================== */
      const r1 = await fetch("/api/admin/dashboard", {
        credentials: "include",
      });
      const d1 = await r1.json();

      setStats({
        totalLicencias: d1.totalLicencias ?? 0,
        licenciasActivas: d1.licenciasActivas ?? 0,
        licenciasBloqueadas: d1.licenciasBloqueadas ?? 0,
        totalPagos: d1.totalPagos ?? 0,
        pendientes: d1.pendientes ?? 0,
        descargasTotales: d1.descargasTotales ?? 0,
        ingresosTotales: d1.ingresosTotales ?? 0,
      });

      /* =====================================
         2. ULTIMOS PAGOS
      ===================================== */
      const r2 = await fetch("/api/admin/pagos/list", {
        credentials: "include",
      });
      const d2 = await r2.json();
      setUltimosPagos(Array.isArray(d2) ? d2.slice(0, 5) : []);

      /* =====================================
         3. ULTIMAS LICENCIAS
      ===================================== */
      const r3 = await fetch("/api/admin/licencias");
      const d3 = await r3.json();
      setUltimasLicencias(
        Array.isArray(d3.licencias) ? d3.licencias.slice(0, 5) : []
      );

      /* =====================================
         4. ULTIMOS USUARIOS
      ===================================== */
      const r4 = await fetch("/api/admin/usuarios");
      const d4 = await r4.json();
      setUltimosUsuarios(
        Array.isArray(d4.users) ? d4.users.slice(0, 5) : []
      );
    }

    load();
  }, []);

  return (
    <div className="space-y-10 max-w-7xl mx-auto min-h-[80vh]">

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

      {/* TARJETAS KPI PREMIUM */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
        <div className="grid gap-4 md:grid-cols-2">
          {ultimosPagos.map((p) => (
            <CardRow key={p.id}>
              <div className="space-y-1">
                <p className="font-semibold">Pago #{p.id}</p>
                <p className="text-sm opacity-70">
                  {p.plugin_id} — {p.estado}
                </p>
              </div>
              <span className="text-sm text-right opacity-70">
                {new Date(p.fecha).toLocaleString()}
              </span>
            </CardRow>
          ))}
        </div>
      </Section>

      {/* ULTIMAS LICENCIAS */}
      <Section title="Últimas licencias">
        <div className="grid gap-4 md:grid-cols-2">
          {ultimasLicencias.map((l) => (
            <CardRow key={l.id}>
              <div className="space-y-1">
                <p className="font-semibold">Licencia #{l.id}</p>
                <p className="text-sm opacity-70">
                  {l.plugin_id} — {l.email_tekla}
                </p>
              </div>
              <span className="text-sm text-right opacity-70">
                {new Date(l.fecha_creacion).toLocaleString()}
              </span>
            </CardRow>
          ))}
        </div>
      </Section>

      {/* ULTIMOS USUARIOS */}
      <Section title="Últimos usuarios">
        <div className="grid gap-4 md:grid-cols-2">
          {ultimosUsuarios.map((u) => (
            <CardRow key={u.id}>
              <p className="font-semibold">{u.email}</p>
              <span className="text-sm text-right opacity-70">
                {new Date(u.created_at).toLocaleString()}
              </span>
            </CardRow>
          ))}
        </div>
      </Section>

    </div>
  );
}

/* ==================== COMPONENTES ==================== */

function Card({ title, value, icon }) {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col gap-3 hover:shadow-xl transition">
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
      <h2 className="text-2xl font-bold border-b border-gray-300 dark:border-gray-700 pb-2">
        {title}
      </h2>
      {children}
    </div>
  );
}

function CardRow({ children }) {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 flex justify-between items-start hover:shadow-md transition">
      {children}
    </div>
  );
}