"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function MisDescargas() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [descargas, setDescargas] = useState([]);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (!data.user) router.push("/login");
        else setUser(data.user);
      });

    fetch("/api/download/history", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setDescargas(data || []));
  }, [router]);

  if (!user) {
    return <p className="text-center mt-20">Cargando...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Mis descargas</h1>

      {descargas.length === 0 && <p>No has descargado nada todavía.</p>}

      <div className="space-y-4">
        {descargas.map((d) => (
          <div
            key={d.id}
            className="bg-white shadow border border-gray-200 rounded p-4"
          >
            <p>
              <span className="font-semibold">Plugin:</span> {d.plugin_nombre}
            </p>
            <p>
              <span className="font-semibold">Fecha:</span> {d.fecha}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
