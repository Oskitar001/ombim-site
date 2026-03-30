"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, Star, Calendar, Ban, CheckCircle } from "lucide-react";

/* Tooltip PREMIUM */
function Tooltip({ label, children }) {
  return (
    <span className="relative group">
      {children}
      <span
        className="
          absolute hidden group-hover:block 
          bg-black text-white text-xs px-2 py-1 rounded 
          -top-6 left-1/2 -translate-x-1/2 
          whitespace-nowrap
        "
      >
        {label}
      </span>
    </span>
  );
}

export default function UserLicenciaDetallePage({ params }) {
  const [id, setId] = useState(null);

  useEffect(() => {
    async function resolver() {
      const resolved = await params;
      setId(resolved.id);
    }
    resolver();
  }, [params]);

  const [licencia, setLicencia] = useState(null);

  useEffect(() => {
    if (!id) return;

    async function load() {
      const r = await fetch(`/api/user/licencia?id=${id}`);
      const d = await r.json();
      setLicencia(d.licencia ?? null);
    }

    load();
  }, [id]);

  if (!licencia)
    return <p className="p-4 text-gray-600 dark:text-gray-300">Cargando licencia...</p>;

  return (
    <div className="max-w-3xl mx-auto space-y-8">

      {/* Volver */}
      <Link
        href="/panel/user/licencias"
        className="flex items-center gap-2 text-blue-600 hover:underline"
      >
        <ArrowLeft size={18} /> Volver
      </Link>

      {/* Título */}
      <h2 className="text-3xl font-bold">Licencia #{licencia.id}</h2>

      {/* Caja premium */}
      <UserSection>

        <Field label="Plugin">
          {licencia.plugin_nombre}
        </Field>

        <Field label="Email Tekla">
          {licencia.email_tekla}
        </Field>

        <Field label="Estado">
          <EstadoBadge estado={licencia.estado} />
        </Field>

        <Field label="Activaciones">
          {licencia.activaciones_usadas} / {licencia.max_activaciones}
        </Field>

        <Field label="Creada">
          {new Date(licencia.fecha_creacion).toLocaleString()}
        </Field>

      </UserSection>
    </div>
  );
}

/* -----------------------------------------------------
   COMPONENTES PREMIUM
----------------------------------------------------- */

function UserSection({ children }) {
  return (
    <section
      className="
        bg-white dark:bg-gray-900 
        border border-gray-300 dark:border-gray-700 
        rounded-xl shadow p-6 space-y-4
      "
    >
      {children}
    </section>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-1">
      <p className="font-semibold text-gray-800 dark:text-gray-200">{label}</p>
      <div className="text-gray-700 dark:text-gray-300">{children}</div>
    </div>
  );
}

/* Badge Premium según estado */
function EstadoBadge({ estado }) {
  const styles = {
    activa: "bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200",
    pendiente: "bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    trial: "bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    bloqueada: "bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200",
    expirada: "bg-orange-200 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  };

  const icons = {
    activa: <CheckCircle size={14} />,
    pendiente: <Clock size={14} />,
    trial: <Star size={14} />,
    bloqueada: <Ban size={14} />,
    expirada: <Calendar size={14} />,
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold
        ${styles[estado] ?? "bg-gray-200 dark:bg-gray-800"}
      `}
    >
      {icons[estado]} {estado.charAt(0).toUpperCase() + estado.slice(1)}
    </span>
  );
}