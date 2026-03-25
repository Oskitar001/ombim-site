"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  KeyRound,
  CreditCard,
  Download,
  User,
  CheckCircle,
  Clock,
  Ban,
} from "lucide-react";

export default function UserDashboardPage() {
  const [licencias, setLicencias] = useState([]);
  const [pagos, setPagos] = useState([]);
  const [plugins, setPlugins] = useState([]);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    async function load() {
      const r1 = await fetch("/api/user/licencias");
      setLicencias((await r1.json()).licencias || []);

      const r2 = await fetch("/api/user/pagos");
      setPagos((await r2.json()).pagos || []);

      const r3 = await fetch("/api/user/plugins");
      setPlugins((await r3.json()).plugins || []);

      const me = await fetch("/api/auth/me");
      const user = await me.json();
      setUserEmail(user?.user?.email || "");
    }
    load();
  }, []);

  const activas = licencias.filter((l) => l.estado === "activa").length;
  const trials = licencias.filter((l) => l.estado === "trial").length;
  const bloqueadas = licencias.filter((l) => l.estado === "bloqueada").length;
  const totalCompras = pagos.length;

  return (
    <div className="space-y-10">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <User size={30} /> Bienvenido, {userEmail}
        </h1>
      </div>

      {/* TARJETAS PRINCIPALES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <Card title="Licencias activas" value={activas} icon={<CheckCircle className="text-green-500" />} />
        <Card title="Trials" value={trials} icon={<Clock className="text-yellow-500" />} />
        <Card title="Bloqueadas" value={bloqueadas} icon={<Ban className="text-red-500" />} />
        <Card title="Total compras" value={totalCompras} icon={<CreditCard className="text-blue-500" />} />

      </div>

      {/* ÚLTIMAS LICENCIAS */}
      <Section title="Últimas licencias">
        {licencias.length === 0 && <p className="text-gray-500">No tienes licencias todavía.</p>}

        {licencias.slice(0, 5).map((l) => (
          <Row key={l.id}>
            <div>
              <p className="font-semibold">{l.plugin_id}</p>
              <p className="text-sm opacity-70">Email Tekla: {l.email_tekla}</p>
            </div>
            <Link href={`/panel/user/licencias/${l.id}`} className="text-blue-600 dark:text-blue-400 hover:underline">
              Ver
            </Link>
          </Row>
        ))}
      </Section>

      {/* ÚLTIMOS PAGOS */}
      <Section title="Últimos pagos">
        {pagos.length === 0 && <p className="text-gray-500">Aún no hay pagos.</p>}

        {pagos.slice(0, 5).map((p) => (
          <Row key={p.id}>
            <div>
              <p className="font-semibold">Pago #{p.id}</p>
              <p className="text-sm opacity-70">Estado: {p.estado}</p>
            </div>
            <Link href={`/panel/user/pagos/${p.id}`} className="text-blue-600 dark:text-blue-400 hover:underline">
              Ver
            </Link>
          </Row>
        ))}
      </Section>

    </div>
  );
}

function Card({ title, value, icon }) {
  return (
    <div className="p-6 rounded-lg bg-gray-200 dark:bg-gray-800 shadow flex flex-col gap-3">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="font-bold text-lg">{title}</h2>
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
  return (
    <div className="p-4 bg-gray-200 dark:bg-gray-800 rounded shadow flex justify-between">
      {children}
    </div>
  );
}
``