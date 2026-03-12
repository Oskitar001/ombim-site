"use client";

import { useEffect, useState } from "react";

export default function ClientePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function cargar() {
    try {
      const res = await fetch("/api/cliente/info");

      if (!res.ok) {
        setError("No autorizado. Inicia sesión.");
        setLoading(false);
        return;
      }

      const json = await res.json();
      setData(json);
      setLoading(false);
    } catch (e) {
      setError("Error cargando datos");
      setLoading(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  if (loading) return <p className="p-10">Cargando...</p>;
  if (error) return <p className="p-10 text-red-600">{error}</p>;

  // Evita errores si dispositivos viene undefined
  const dispositivos = data.dispositivos || [];

  return (
    <div className="p-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Panel del Cliente</h1>

      <div className="bg-white shadow p-6 rounded mb-6">
        <h2 className="text-xl font-bold mb-4">Información de la licencia</h2>

        <p><strong>Email:</strong> {data.email}</p>
        <p><strong>Estado:</strong> {data.estado}</p>
        <p><strong>Fecha expiración:</strong> {data.fecha_expiracion}</p>
        <p><strong>Días restantes:</strong> {data.dias_restantes}</p>
      </div>

      <div className="bg-white shadow p-6 rounded mb-6">
        <h2 className="text-xl font-bold mb-4">Dispositivos activos</h2>

        {dispositivos.length === 0 ? (
          <p>No hay dispositivos registrados.</p>
        ) : (
          <ul className="list-disc ml-6">
            {dispositivos.map((d) => (
              <li key={d.id}>
                {d.hardware_id} — {new Date(d.created_at).toLocaleString()}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
