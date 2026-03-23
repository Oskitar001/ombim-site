"use client";

import { useEffect, useState } from "react";

export default function MisLicenciasPage() {
  const [licencias, setLicencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await fetch("/api/licencias/mias", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setError(data.error || "Error cargando licencias");
          setLoading(false);
          return;
        }

        const data = await res.json();
        setLicencias(data || []);
      } catch (e) {
        setError("Error de conexión");
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, []);

  if (loading) return <div className="p-4">Cargando licencias...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  if (!licencias.length) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-semibold mb-2">Mis licencias</h1>
        <p>No tienes licencias todavía.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Mis licencias</h1>
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left">Plugin</th>
              <th className="px-3 py-2 text-left">Email Tekla</th>
              <th className="px-3 py-2 text-left">Estado</th>
              <th className="px-3 py-2 text-left">Activaciones</th>
              <th className="px-3 py-2 text-left">Creada</th>
            </tr>
          </thead>
          <tbody>
            {licencias.map((l) => (
              <tr key={l.id} className="border-t">
                <td className="px-3 py-2">{l.plugin_nombre}</td>
                <td className="px-3 py-2">{l.email_tekla || "—"}</td>
                <td className="px-3 py-2">{l.estado}</td>
                <td className="px-3 py-2">
                  {l.activaciones_usadas}/{l.max_activaciones}
                </td>
                <td className="px-3 py-2">
                  {l.fecha_creacion
                    ? new Date(l.fecha_creacion).toLocaleDateString()
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
