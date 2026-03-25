"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, KeyRound } from "lucide-react";

export default function LicenciaDetallePage({ params }) {
  const [licencia, setLicencia] = useState(null);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/user/licencias/${params.id}`);
      const data = await res.json();
      setLicencia(data.licencia);
    }
    load();
  }, [params.id]);

  if (!licencia) return <p>Cargando...</p>;

  return (
    <div className="space-y-6">

      <Link href="/panel/user/licencias" className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white">
        <ArrowLeft size={20} /> Volver
      </Link>

      <h1 className="text-2xl font-bold flex items-center gap-2">
        <KeyRound size={28} /> Licencia {licencia.id}
      </h1>

      <div className="p-6 rounded-lg bg-gray-200 dark:bg-gray-800 space-y-3">
        <p><strong>Plugin:</strong> {licencia.plugin_id}</p>
        <p><strong>Email Tekla:</strong> {licencia.email_tekla}</p>
        <p><strong>Estado:</strong> {licencia.estado}</p>
        <p><strong>Activaciones:</strong> {licencia.activaciones_usadas} / {licencia.max_activaciones}</p>
        <p><strong>Creada:</strong> {new Date(licencia.fecha_creacion).toLocaleString()}</p>
      </div>

    </div>
  );
}