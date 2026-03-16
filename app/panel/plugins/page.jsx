"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminPlugins() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [plugins, setPlugins] = useState([]);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        if (!data.user || data.user.role !== "admin") router.push("/login");
        else setUser(data.user);
      });

    fetch("/api/plugin")
      .then(res => res.json())
      .then(data => setPlugins(data));
  }, []);

  return (
    <div className="max-w-4xl mx-auto pt-32 px-6">
      <h1 className="text-3xl font-bold mb-6">Gestión de Plugins</h1>

      {plugins.map(p => (
        <div key={p.id} className="bg-white shadow p-4 rounded mb-6">
          <h2 className="text-xl font-semibold">{p.nombre}</h2>
          <p className="mb-3">{p.descripcion}</p>

          <div className="flex gap-4">
            <Link href={`/panel/editar-plugin/${p.id}`} className="text-blue-600 hover:underline">
              Editar
            </Link>
            <Link href={`/api/plugin/delete?id=${p.id}`} className="text-red-600 hover:underline">
              Borrar
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
