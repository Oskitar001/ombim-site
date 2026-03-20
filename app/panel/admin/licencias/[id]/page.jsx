"use client";

import { useEffect, useState } from "react";
import LicenciaAcciones from "@/components/admin/LicenciaAcciones";
import EditarNotas from "@/components/admin/EditarNotas";
import CambiarTipo from "@/components/admin/CambiarTipo";

export default function LicenciaDetalle({ params }) {
  const { id } = params;

  const [licencia, setLicencia] = useState(null);
  const [activaciones, setActivaciones] = useState([]);
  const [tipos, setTipos] = useState([]);

  async function cargar() {
    const res = await fetch(`/api/admin/licencias/${id}`);
    const data = await res.json();

    setLicencia(data.licencia);
    setActivaciones(data.activaciones);

    const tiposRes = await fetch("/api/admin/licencias-tipos");
    const tiposData = await tiposRes.json();
    setTipos(tiposData.tipos || []);
  }

  useEffect(() => {
    cargar();
  }, []);

  if (!licencia) return <p>Cargando...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Licencia</h2>

      <p><b>Email Tekla:</b> {licencia.email_tekla}</p>
      <p><b>Plugin:</b> {licencia.plugin_id}</p>
      <p><b>Estado:</b> {licencia.estado}</p>
      <p><b>Expira:</b> {licencia.fecha_expiracion || "—"}</p>

      <LicenciaAcciones id={id} onUpdated={cargar} />

      <EditarNotas id={id} notasIniciales={licencia.notas} onUpdated={cargar} />

      <CambiarTipo id={id} tipos={tipos} tipoActual={licencia.tipo_id} onUpdated={cargar} />

      <h3 className="text-xl font-bold mt-6 mb-2">Activaciones</h3>

      <ul className="list-disc ml-6">
        {activaciones.map((a) => (
          <li key={a.id}>{a.hardware_id}</li>
        ))}
      </ul>
    </div>
  );
}
