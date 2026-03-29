"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  KeyRound,
  CheckCircle,
  Ban,
  RefreshCw,
  Calendar,
  Star,
} from "lucide-react";

export default function AdminLicenciaDetallePage({ params }) {
  // Next.js 16 fix (params es una Promise)
  const { id } = use(params);

  const [licencia, setLicencia] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function load() {
      const r = await fetch(`/api/admin/licencias/${id}`, {
        credentials: "include",
      });

      const d = await r.json();
      setLicencia(d.licencia ?? null);
      setLoading(false);
    }
    load();
  }, [id]);

  if (!id) return <p>ID inválido</p>;
  if (loading) return <p>Cargando licencia…</p>;
  if (!licencia) return <p>Licencia no encontrada</p>;

  async function accion(endpoint) {
    await fetch(`/api/admin/licencias/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: licencia.id }),
    });

    location.reload();
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto p-4">

      {/* VOLVER */}
      <Link
        href="/panel/admin/licencias"
        className="text-blue-600 hover:underline flex items-center gap-1"
      >
        <ArrowLeft size={20} /> Volver
      </Link>

      {/* TÍTULO */}
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <KeyRound size={30} /> Licencia #{licencia.id}
      </h1>

      {/* CARD PREMIUM DATOS */}
      <div className="
        p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 
        bg-white dark:bg-gray-900 space-y-4
      ">
        <Row label="Plugin">
          {licencia.plugins?.nombre ?? licencia.plugin_id}
        </Row>

        <Row label="Email Tekla">
          {licencia.email_tekla}
        </Row>

        <Row label="Tipo">
          <TipoBadge tipo={licencia.tipo} />
        </Row>

        <Row label="Estado">
          <EstadoBadge estado={licencia.estado} />
        </Row>

        <Row label="Activaciones">
          {licencia.activaciones_usadas}/{licencia.max_activaciones}
        </Row>

        <Row label="Expira">
          {licencia.fecha_expiracion
            ? new Date(licencia.fecha_expiracion).toLocaleString()
            : "—"}
        </Row>

        <Row label="Creada">
          {new Date(licencia.fecha_creacion).toLocaleString()}
        </Row>
      </div>

      {/* ACCIONES */}
      <div className="space-y-3">
        <ActionButton
          color="green"
          icon={<CheckCircle size={18} />}
          label="Activar"
          onClick={() => accion("activar")}
        />

        <ActionButton
          color="red"
          icon={<Ban size={18} />}
          label="Bloquear"
          onClick={() => accion("bloquear")}
        />

        <ActionButton
          color="purple"
          icon={<RefreshCw size={18} />}
          label="Reset activaciones"
          onClick={() => accion("reset-activaciones")}
        />

        <ActionButton
          color="yellow"
          icon={<Calendar size={18} />}
          label="Hacer anual"
          onClick={() => accion("hacer-anual")}
        />

        <ActionButton
          color="indigo"
          icon={<Star size={18} />}
          label="Hacer completa"
          onClick={() => accion("hacer-completa")}
        />
      </div>

    </div>
  );
}

/* ================= COMPONENTES PREMIUM ================= */

function Row({ label, children }) {
  return (
    <div className="flex justify-between items-start">
      <p className="font-semibold text-gray-700 dark:text-gray-300">
        {label}:
      </p>
      <p className="text-right">{children}</p>
    </div>
  );
}

function TipoBadge({ tipo }) {
  const map = {
    anual: {
      color: "bg-yellow-200 text-yellow-800",
      icon: <Calendar size={14} />,
      label: "Anual",
    },
    completa: {
      color: "bg-purple-200 text-purple-800",
      icon: <Star size={14} />,
      label: "Completa",
    },
    trial: {
      color: "bg-blue-200 text-blue-800",
      icon: <KeyRound size={14} />,
      label: "Trial",
    },
  };

  const t = map[tipo];

  return (
    <span
      className={`px-2 py-1 rounded text-xs font-semibold inline-flex items-center gap-1 ${t.color}`}
    >
      {t.icon} {t.label}
    </span>
  );
}

function EstadoBadge({ estado }) {
  const map = {
    activa: {
      color: "bg-green-200 text-green-800",
      icon: <CheckCircle size={14} />,
      label: "Activa",
    },
    bloqueada: {
      color: "bg-red-200 text-red-800",
      icon: <Ban size={14} />,
      label: "Bloqueada",
    },
    trial: {
      color: "bg-blue-200 text-blue-800",
      icon: <KeyRound size={14} />,
      label: "Trial",
    },
    expirada: {
      color: "bg-orange-200 text-orange-800",
      icon: <Calendar size={14} />,
      label: "Expirada",
    },
  };

  const e = map[estado];

  return (
    <span
      className={`px-2 py-1 rounded text-xs font-semibold inline-flex items-center gap-1 ${e.color}`}
    >
      {e.icon} {e.label}
    </span>
  );
}

function ActionButton({ color, icon, label, onClick }) {
  const bg = {
    green: "bg-green-600 hover:bg-green-700",
    red: "bg-red-600 hover:bg-red-700",
    purple: "bg-purple-600 hover:bg-purple-700",
    yellow: "bg-yellow-600 hover:bg-yellow-700",
    indigo: "bg-indigo-600 hover:bg-indigo-700",
  }[color];

  return (
    <button
      onClick={onClick}
      className={`${bg} text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md transition`}
    >
      {icon} {label}
    </button>
  );
}