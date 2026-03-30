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

/* -----------------------------------------------------
   DASHBOARD USER — ESTÉTICA PREMIUM (igual que admin)
----------------------------------------------------- */

export default function UserDashboardPage() {
  const [licencias, setLicencias] = useState([]);
  const [pagos, setPagos] = useState([]);
  const [plugins, setPlugins] = useState([]);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    async function load() {
      const r1 = await fetch("/api/user/licencias", { credentials: "include" });
      setLicencias((await r1.json()).licencias || []);

      const r2 = await fetch("/api/user/pagos", { credentials: "include" });
      setPagos((await r2.json()).pagos || []);

      const r3 = await fetch("/api/user/plugins", { credentials: "include" });
      setPlugins((await r3.json()).plugins || []);

      const me = await fetch("/api/auth/me", { credentials: "include" });
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

      {/* ============= HEADER ============= */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <User size={32} />
          Bienvenido, {userEmail}
        </h1>
      </div>

      {/* ============= TARJETAS PREMIUM ============= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <UserCard
          title="Licencias activas"
          value={activas}
          icon={<CheckCircle className="text-green-600" />}
        />

        <UserCard
          title="Trials"
          value={trials}
          icon={<Clock className="text-yellow-600" />}
        />

        <UserCard
          title="Bloqueadas"
          value={bloqueadas}
          icon={<Ban className="text-red-600" />}
        />

        <UserCard
          title="Total compras"
          value={totalCompras}
          icon={<CreditCard className="text-blue-600" />}
        />

      </div>

      {/* ============= ÚLTIMAS LICENCIAS ============= */}
      <UserSection title="Últimas licencias">
        {licencias.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400">No tienes licencias todavía.</p>
        )}

        {licencias.slice(0, 5).map((l) => (
          <UserRow key={l.id}>
            <div>
              <p className="font-semibold">{l.plugin_id}</p>
              <p className="text-sm opacity-70">Email Tekla: {l.email_tekla}</p>
            </div>

            <Link
              href={`/panel/user/licencias/${l.id}`}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Ver
            </Link>
          </UserRow>
        ))}
      </UserSection>

      {/* ============= ÚLTIMOS PAGOS ============= */}
      <UserSection title="Últimos pagos">
        {pagos.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400">Aún no hay pagos.</p>
        )}

        {pagos.slice(0, 5).map((p) => (
          <UserRow key={p.id}>
            <div>
              <p className="font-semibold">Pago #{p.id}</p>
              <p className="text-sm opacity-70">Estado: {p.estado}</p>
            </div>

            <Link
              href={`/panel/user/pagos/${p.id}`}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Ver
            </Link>
          </UserRow>
        ))}
      </UserSection>

    </div>
  );
}

/* -----------------------------------------------------
   COMPONENTES PREMIUM (Iguales al panel admin)
----------------------------------------------------- */

function UserCard({ title, value, icon }) {
  return (
    <div
      className="
        bg-white dark:bg-gray-900
        border border-gray-300 dark:border-gray-700
        rounded-xl shadow p-6 
        flex flex-col gap-3
      "
    >
      <div className="flex items-center gap-3">
        {icon}
        <h2 className="font-bold text-lg">{title}</h2>
      </div>

      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}

function UserSection({ title, children }) {
  return (
    <div
      className="
        bg-white dark:bg-gray-900 
        border border-gray-300 dark:border-gray-700
        rounded-xl shadow p-6 space-y-4
      "
    >
      <h2 className="text-xl font-bold border-b border-gray-300 dark:border-gray-700 pb-2">
        {title}
      </h2>

      <div className="space-y-3">{children}</div>
    </div>
  );
}

function UserRow({ children }) {
  return (
    <div
      className="
        p-4 
        bg-gray-100 dark:bg-gray-800 
        border border-gray-300 dark:border-gray-700 
        rounded-lg shadow 
        flex justify-between items-center
      "
    >
      {children}
    </div>
  );
}