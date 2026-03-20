"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PanelPagos() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [pagos, setPagos] = useState([]);

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

    // Cargar pagos
    fetch("/api/pagos/todos")
      .then(res => res.json())
      .then(data => setPagos(data || []));
  }, [router]);

  if (!user || role !== "admin") return <p className="pt-32 text-center">Cargando...</p>;

  return (
    <div className="max-w-5xl mx-auto pt-32 px-6">
      <h1 className="text-3xl font-bold mb-6">Pagos</h1>

      <div className="space-y-4">
        {pagos.map((p) => (
          <div
            key={p.id}
            className="bg-white dark:bg-[#1a1a1a] p-4 rounded shadow border border-gray-300 dark:border-gray-700"
          >
            <p><strong>Usuario:</strong> {p.user_email}</p>
            <p><strong>Plugin:</strong> {p.plugin_id}</p>
            <p><strong>Cantidad:</strong> {p.cantidad} €</p>
            <p><strong>Estado:</strong> {p.estado}</p>
            <p><strong>Método:</strong> {p.metodo}</p>
            <p><strong>Fecha:</strong> {new Date(p.fecha).toLocaleString()}</p>

            <Link
              href={`/panel/licencias-admin?plugin=${p.plugin_id}&user=${p.user_id}`}
              className="text-blue-600 dark:text-blue-400 underline mt-2 inline-block"
            >
              Ver licencias relacionadas
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
