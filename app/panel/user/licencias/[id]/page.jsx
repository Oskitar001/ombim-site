"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import ConfirmDialog from "@/components/ConfirmDialog";
import { ArrowLeft, KeyRound, CheckCircle, Clock, Ban, RefreshCw } from "lucide-react";

function Tooltip({ label, children }) {
  return (
    <span className="relative group">
      {children}
      <span className="absolute hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
        {label}
      </span>
    </span>
  );
}

export default function UserLicenciaDetallePage({ params }) {
  const { id } = use(params);

  const [licencia, setLicencia] = useState(null);
  const [open, setOpen] = useState(false);
  const [accion, setAccion] = useState(null);

  useEffect(() => {
    async function load() {
      const r = await fetch(`/api/user/licencia?id=${id}`);
      const d = await r.json();
      setLicencia(d.licencia ?? null);
    }
    load();
  }, [id]);

  if (!licencia) return <p className="p-4">Cargando licencia...</p>;

  return (
    <div className="p-4">
      <Link
        href="/panel/user/licencias"
        className="flex items-center gap-2 text-blue-600 mb-4"
      >
        <ArrowLeft size={18} /> Volver
      </Link>

      <h2 className="text-2xl font-bold mb-4">Licencia #{licencia.id}</h2>

      <p><strong>Plugin:</strong> {licencia.plugin_nombre}</p>
      <p><strong>Email Tekla:</strong> {licencia.email_tekla}</p>

      <p>
        <strong>Estado:</strong>{" "}
        {licencia.estado === "pendiente" && (
          <span className="text-yellow-500">Pendiente</span>
        )}
        {licencia.estado === "activa" && (
          <span className="text-green-600">Activa</span>
        )}
        {licencia.estado === "trial" && (
          <span className="text-blue-600">Trial</span>
        )}
        {licencia.estado === "bloqueada" && (
          <span className="text-red-600">Bloqueada</span>
        )}
      </p>

      <p>
        <strong>Activaciones:</strong>{" "}
        {licencia.activaciones_usadas} / {licencia.max_activaciones}
      </p>

      <p>
        <strong>Creada:</strong>{" "}
        {new Date(licencia.fecha_creacion).toLocaleString()}
      </p>
    </div>
  );
}