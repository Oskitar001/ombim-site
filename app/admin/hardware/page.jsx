// ======================================================
// PÁGINA HARDWARE - app/admin/hardware/page.jsx
// ======================================================
"use client";
import { useEffect, useState } from "react";

export default function AdminHardwarePage() {
  const [hardware, setHardware] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/hardware/list")
      .then((res) => res.json())
      .then((data) => {
        setHardware(data.hardware || []);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-10">Cargando hardware...</div>;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Gestión de Hardware</h1>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">Usuario</th>
            <th className="p-2 text-left">Email Tekla</th>
            <th className="p-2 text-left">Machine ID</th>
            <th className="p-2 text-left">Creado</th>
          </tr>
        </thead>
        <tbody>
          {hardware.map((h) => (
            <tr key={h.id} className="border-b">
              <td className="p-2">{h.id}</td>
              <td className="p-2">{h.user_id}</td>
              <td className="p-2">{h.tekla_email}</td>
              <td className="p-2">{h.machine_id}</td>
              <td className="p-2">
                {h.created_at ? new Date(h.created_at).toLocaleString() : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}