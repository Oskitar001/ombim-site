"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LicenciasAdmin() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [licencias, setLicencias] = useState([]);

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

    // Cargar todas las licencias
    fetch("/api/licencias/todas")
      .then(res => res.json())
      .then(data => setLicencias(data || []));
  }, [router]);

  if (!user || role !== "admin") return <p className="pt-32 text-center">Cargando...</p>;

  return (
    <div className="max-w-6xl mx-auto pt-32 px-6">
      <h1 className="text-3xl font-bold mb-6">Licencias Generadas</h1>

      <div className="space-y-4">
        {licencias.map((l) => (
          <div
            key={l.id}
            className="bg-white dark:bg-[#1a1a1a] p-4 rounded shadow border border-gray-300 dark:border-gray-700"
          >
            <p><strong>ID:</strong> {l.id}</p>
            <p><strong>Usuario:</strong> {l.email_tekla}</p>
            <p><strong>Plugin:</strong> {l.plugin_id}</p>
            <p><strong>Estado:</strong> {l.estado}</p>
            <p><strong>Activaciones:</strong> {l.activaciones_usadas}/{l.max_activaciones}</p>

            {l.fecha_creacion && (
              <p><strong>Creada:</strong> {new Date(l.fecha_creacion).toLocaleString()}</p>
            )}

            {l.fecha_expiracion && (
              <p><strong>Expira:</strong> {new Date(l.fecha_expiracion).toLocaleDateString()}</p>
            )}

            {l.notas && (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                <strong>Notas:</strong> {l.notas}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
