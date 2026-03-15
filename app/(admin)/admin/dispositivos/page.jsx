"use client";

import { useEffect, useState } from "react";

export default function DispositivosPage() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/admin/dispositivos");
      const data = await res.json();
      setDevices(data.devices || []);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dispositivos</h1>

      {loading ? (
        <p>Cargando...</p>
      ) : devices.length === 0 ? (
        <p>No hay dispositivos registrados.</p>
      ) : (
        <ul className="space-y-3">
          {devices.map((d) => (
            <li key={d.id} className="border p-4 rounded-lg">
              <p><strong>ID:</strong> {d.id}</p>
              <p><strong>Usuario:</strong> {d.usuario_id}</p>
              <p><strong>Hardware:</strong> {d.hardware_id}</p>
              <p><strong>Última conexión:</strong> {d.ultima_conexion}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
