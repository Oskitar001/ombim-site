"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, KeyRound, CheckCircle, Clock, Ban, RefreshCw } from "lucide-react";
import Link from "next/link";

function EstadoBadge({ estado }) {
  if (estado === "activa")
    return <span className="px-2 py-1 bg-green-200 text-green-800 rounded text-xs font-semibold">Activa</span>;

  if (estado === "trial")
    return <span className="px-2 py-1 bg-blue-200 text-blue-800 rounded text-xs font-semibold">Trial</span>;

  if (estado === "bloqueada")
    return <span className="px-2 py-1 bg-red-200 text-red-800 rounded text-xs font-semibold">Bloqueada</span>;

  return <span className="px-2 py-1 bg-gray-200 text-gray-800 rounded text-xs font-semibold">—</span>;
}

export default function AdminLicenciaDetallePage({ params }) {

  // ❗ AQUI ESTÁ EL FIX REAL:
  const id = params?.id;  

  const [licencia, setLicencia] = useState(null);

  useEffect(() => {
    if (!id) return; // ← Evita llamadas con undefined

    async function load() {
      const r = await fetch(`/api/admin/licencias/${id}`);
      const d = await r.json();
      setLicencia(d.licencia ?? null);
    }

    load();
  }, [id]);

  if (!id) return <p className="p-4">ID no válido</p>;
  if (!licencia) return <p className="p-4">Cargando licencia...</p>;

  async function accion(tipo) {
    const endpoint = {
      activar: "/api/licencias/activar",
      trial: "/api/licencias/trial",
      bloquear: "/api/licencias/bloquear",
      reset: "/api/licencias/reset-activaciones",
    }[tipo];

    await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ licencia_id: licencia.id }),
    });

    location.reload();
  }

  return (
    <div className="space-y-6 p-4">

      <Link href="/panel/admin/licencias" className="text-blue-600 hover:underline flex items-center gap-1">
        <ArrowLeft size={20} /> Volver
      </Link>

      <h1 className="text-3xl font-bold flex items-center gap-2">
        <KeyRound size={28} /> Licencia #{licencia.id}
      </h1>

      <div className="p-6 rounded-lg bg-gray-200 dark:bg-gray-800 shadow space-y-3">
        <p><strong>Plugin:</strong> {licencia.plugin_id}</p>
        <p><strong>Email Tekla:</strong> {licencia.email_tekla}</p>
        <p><strong>Estado:</strong> <EstadoBadge estado={licencia.estado} /></p>
        <p><strong>Activaciones:</strong> {licencia.activaciones_usadas}/{licencia.max_activaciones}</p>
        <p><strong>Creada:</strong> {new Date(licencia.fecha_creacion).toLocaleString()}</p>
      </div>

      <div className="flex flex-col gap-3 max-w-sm">
        <button onClick={() => accion("activar")} className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2">
          <CheckCircle size={18} /> Activar
        </button>

        <button onClick={() => accion("trial")} className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2">
          <Clock size={18} /> Trial
        </button>

        <button onClick={() => accion("bloquear")} className="bg-red-600 text-white px-4 py-2 rounded flex items-center gap-2">
          <Ban size={18} /> Bloquear
        </button>

        <button onClick={() => accion("reset")} className="bg-purple-600 text-white px-4 py-2 rounded flex items-center gap-2">
          <RefreshCw size={18} /> Reset activaciones
        </button>
      </div>

    </div>
  );
}