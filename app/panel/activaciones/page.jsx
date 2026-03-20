"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ActivacionesAdmin() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [activaciones, setActivaciones] = useState([]);

  useEffect(() => {
    // Verificar admin
    fetch("/api/auth/me", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        if (!data.user || data.role !== "admin") {
          router.push("/login");
        } else {
          setUser(data.user);
          setRole(data.role);
        }
      });

    // Cargar activaciones
    fetch("/api/licencias/activaciones/todas")
      .then(res => res.json())
      .then(data => setActivaciones(data || []));
  }, [router]);

  if (!user || role !== "admin") return <p className="pt-32 text-center">Cargando...</p>;

  return (
    <div className="max-w-6xl mx-auto pt-32 px-6">
      <h1 className="text-3xl font-bold mb-6">Activaciones de Licencias</h1>

      <div className="space-y-4">
        {activaciones.map((a) => (
          <div
            key={a.id}
            className="bg-white dark:bg-[#1a1a1a] p-4 rounded shadow border border-gray-300 dark:border-gray-700"
          >
            <p><strong>ID Activación:</strong> {a.id}</p>
            <p><strong>ID Licencia:</strong> {a.licencia_id}</p>
            <p><strong>Email Tekla:</strong> {a.email_tekla}</p>
            <p><strong>Plugin:</strong> {a.plugin_id}</p>
            <p><strong>Machine ID:</strong> {a.machine_id}</p>

            {a.fecha && (
              <p><strong>Fecha:</strong> {new Date(a.fecha).toLocaleString()}</p>
            )}

            {a.ip && (
              <p><strong>IP:</strong> {a.ip}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
