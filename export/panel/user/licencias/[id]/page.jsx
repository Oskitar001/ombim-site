"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, Star, Calendar, Ban, CheckCircle } from "lucide-react";

export default function UserLicenciaDetallePage({ params }) {
  const [id, setId] = useState(null);
  const [licencia, setLicencia] = useState(null);

  useEffect(() => {
    async function resolver() {
      const resolved = await params;
      setId(resolved.id);
    }
    resolver();
  }, [params]);

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
    return <p className="p-4 text-gray-600">Cargando licencia...</p>;

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

      <UserSection>

        {/* ✅ Plugin */}
        <Field label="Plugin">
          {licencia.plugin_nombre || licencia.plugin_id}
        </Field>

        {/* ✅ LICENSE KEY (LO MÁS IMPORTANTE) */}
        <div className="space-y-1">
          <p className="font-semibold text-gray-800">License Key</p>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={licencia.license_key}
              readOnly
              className="w-full border p-2 rounded bg-gray-100"
            />

            <button
              onClick={() => {
                navigator.clipboard.writeText(licencia.license_key);
                alert("Clave copiada");
              }}
              className="bg-gray-600 text-white px-3 py-2 rounded"
            >
              Copiar
            </button>
          </div>
        </div>

        {/* ✅ Estado */}
        <Field label="Estado">
          <EstadoBadge estado={licencia.estado} />
        </Field>

        {/* ✅ Activaciones */}
        <Field label="Activaciones">
          {licencia.activaciones_usadas} / {licencia.max_activaciones}
        </Field>

        {/* ✅ Creación */}
        <Field label="Creada">
          {new Date(licencia.fecha_creacion).toLocaleString()}
        </Field>

        {/* ✅ Expiración */}
        <Field label="Expira">
          {licencia.fecha_expiracion
            ? new Date(licencia.fecha_expiracion).toLocaleDateString()
            : "—"}
        </Field>

      </UserSection>
    </div>
  );
}

/* ---------- COMPONENTES ---------- */

function UserSection({ children }) {
  return (
    <section className="bg-white border rounded-xl shadow p-6 space-y-4">
      {children}
    </section>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-1">
      <p className="font-semibold text-gray-800">{label}</p>
      <div className="text-gray-700">{children}</div>
    </div>
  );
}

function EstadoBadge({ estado }) {
  const styles = {
    activa: "bg-green-200 text-green-800",
    pendiente: "bg-yellow-200 text-yellow-800",
    trial: "bg-blue-200 text-blue-800",
    bloqueada: "bg-red-200 text-red-800",
    expirada: "bg-orange-200 text-orange-800",
  };

  const icons = {
    activa: <CheckCircle size={14} />,
    pendiente: <Clock size={14} />,
    trial: <Star size={14} />,
    bloqueada: <Ban size={14} />,
    expirada: <Calendar size={14} />,
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${styles[estado]}`}>
      {icons[estado]} {estado}
    </span>
  );
}