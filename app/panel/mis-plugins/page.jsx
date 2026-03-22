"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminPlugins() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [plugins, setPlugins] = useState([]);

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

    // Obtener plugins
    fetch("/api/plugin")
      .then(res => res.json())
      .then(data => setPlugins(data || []));
  }, [router]);

  if (!user || role !== "admin") {
    return <p className="pt-32 text-center">Cargando...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto pt-32 px-6 bg-[#f3f4f6]Soft dark:bg-[#242424] min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-[#1f2937] dark:text-[#e6e6e6]">
        Gestión de Plugins
      </h1>

      {plugins.map(p => (
        <div
          key={p.id}
          className="bg-[#f3f4f6]Soft dark:bg-[#1a1a1a] shadow p-4 rounded mb-6 border border-[#d1d5db] dark:border-[#3a3a3a]"
        >
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold text-[#1f2937] dark:text-[#e6e6e6]">
                {p.nombre}
              </h2>

              <p className="mb-2 text-[#1f2937] dark:text-[#e6e6e6]">
                {p.descripcion}
              </p>

              <p className="font-semibold">
                {p.precio > 0 ? `${p.precio} € (De pago)` : "Gratis"}
              </p>
            </div>

            <div className="flex flex-col gap-2 text-right">
              <Link
                href={`/plugins/${p.id}`}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Ver plugin
              </Link>

              <Link
                href={`/panel/pagos?plugin=${p.id}`}
                className="text-purple-600 dark:text-purple-400 hover:underline"
              >
                Ver pagos
              </Link>

              <Link
                href={`/panel/editar-plugin/${p.id}`}
                className="text-green-600 dark:text-green-400 hover:underline"
              >
                Editar
              </Link>

              <button
                onClick={async () => {
                  if (!confirm("¿Seguro que quieres borrar este plugin?")) return;

                  const res = await fetch(`/api/plugin/delete?id=${p.id}`, {
                    method: "DELETE"
                  });

                  if (res.ok) {
                    setPlugins(prev => prev.filter(x => x.id !== p.id));
                  } else {
                    alert("Error al borrar el plugin.");
                  }
                }}
                className="text-red-600 dark:text-red-400 hover:underline"
              >
                Borrar
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
