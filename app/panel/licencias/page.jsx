"use client";

import { useEffect, useState } from "react";

export default function MisLicenciasPage() {
  const [licencias, setLicencias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargar() {
      const res = await fetch("/api/licencias/mias");
      const data = await res.json();
      setLicencias(data || []);
      setLoading(false);
    }
    cargar();
  }, []);

  if (loading) return <p>Cargando licencias...</p>;

  return (
    <div className="max-w-4xl mx-auto pt-10">
      <h1 className="text-3xl font-bold mb-6">Mis licencias</h1>

      {licencias.length === 0 && <p>No tienes licencias activas.</p>}

      {licencias.map((lic) => (
        <div key={lic.id} className="border p-4 mb-4 rounded bg-white shadow">
          <p><strong>ID:</strong> {lic.id}</p>
          <p><strong>Email Tekla:</strong> {lic.email_tekla}</p>
          <p><strong>Plugin:</strong> {lic.plugin_nombre}</p>
          <p><strong>Estado:</strong> {lic.estado}</p>
          <p><strong>Activaciones:</strong> {lic.activaciones_usadas}/{lic.max_activaciones}</p>
          <p><strong>Fecha:</strong> {new Date(lic.fecha_creacion).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}
