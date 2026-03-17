"use client";

import { useEffect, useState } from "react";

export default function LicenseEditPage({ params }) {
  const { id } = params;
  const [licencia, setLicencia] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar datos de la licencia
  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/admin/licencias/${id}`);
      const data = await res.json();
      setLicencia(data);
      setLoading(false);
    }
    load();
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();

    await fetch(`/api/admin/licencias/${id}`, {
      method: "PUT",
      body: JSON.stringify(licencia),
    });

    alert("Licencia actualizada");
  }

  if (loading) return <p>Cargando...</p>;
  if (!licencia) return <p>No encontrada</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Editar licencia</h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "400px" }}>
        
        <label>
          Estado:
          <select
            value={licencia.estado}
            onChange={(e) => setLicencia({ ...licencia, estado: e.target.value })}
          >
            <option value="activa">Activa</option>
            <option value="bloqueada">Bloqueada</option>
            <option value="expirada">Expirada</option>
            <option value="trial">Trial</option>
          </select>
        </label>

        <label>
          Fecha expiración:
          <input
            type="date"
            value={licencia.fecha_expiracion?.split("T")[0] || ""}
            onChange={(e) => setLicencia({ ...licencia, fecha_expiracion: e.target.value })}
          />
        </label>

        <label>
          Máx. activaciones:
          <input
            type="number"
            value={licencia.max_activaciones}
            onChange={(e) => setLicencia({ ...licencia, max_activaciones: Number(e.target.value) })}
          />
        </label>

        <label>
          Notas:
          <textarea
            value={licencia.notas || ""}
            onChange={(e) => setLicencia({ ...licencia, notas: e.target.value })}
          />
        </label>

        <button type="submit">Guardar cambios</button>
      </form>
    </div>
  );
}
