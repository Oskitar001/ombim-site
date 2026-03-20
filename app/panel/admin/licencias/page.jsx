"use client";

import { useState, useEffect } from "react";
import LicenciasTable from "@/components/admin/LicenciasTable";
import CrearLicenciaModal from "@/components/admin/CrearLicenciaModal";

export default function LicenciasPage() {
  const [licencias, setLicencias] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  async function cargarLicencias() {
    setLoading(true);
    const res = await fetch(`/api/admin/licencias?q=${q}`);
    const data = await res.json();
    setLicencias(data.licencias || []);
    setLoading(false);
  }

  useEffect(() => {
    cargarLicencias();
  }, [q]);

  return (
    <div>
      <div className="flex justify-between mb-4">
        <input
          className="border p-2 rounded"
          placeholder="Buscar..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => setModalOpen(true)}
        >
          Crear licencia
        </button>
      </div>

      {loading ? <p>Cargando...</p> : <LicenciasTable licencias={licencias} />}

      {modalOpen && (
        <CrearLicenciaModal
          onClose={() => setModalOpen(false)}
          onCreated={cargarLicencias}
        />
      )}
    </div>
  );
}
