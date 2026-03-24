// /app/panel/mis-licencias/page.jsx
"use client";

import { useEffect, useState } from "react";

export default function MisLicenciasPage() {
  const [licencias, setLicencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargar() {
      try {
        const res = await fetch("/api/licencias/mias");
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setError(data.error ?? "Error cargando licencias");
          return;
        }

        const data = await res.json();
        setLicencias(data);
      } catch {
        setError("Error de conexión");
      } finally {
        setLoading(false);
      }
    }

    cargar();
  }, []);

  if (loading) return <p>Cargando licencias…</p>;
  if (error) return <p>{error}</p>;

  if (!licencias.length) {
    return (
      <div>
        <h1 className="text-xl font-bold mb-4">Mis licencias</h1>
        <p>No tienes licencias todavía.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Mis licencias</h1>

      <table className="w-full">
        <thead>
          <tr>
            <th>Plugin</th>
            <th>Email Tekla</th>
            <th>Estado</th>
            <th>Activaciones</th>
            <th>Creada</th>
          </tr>
        </thead>

        <tbody>
          {licencias.map((l) => (
            <tr key={l.id}>
              <td>{l.plugin_nombre}</td>
              <td>{l.email_tekla || "—"}</td>
              <td>{l.estado}</td>
              <td>{l.activaciones_usadas}/{l.max_activaciones}</td>
              <td>{new Date(l.fecha_creacion).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}