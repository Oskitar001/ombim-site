"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function MisDescargas() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [descargas, setDescargas] = useState([]);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        if (!data.user) router.push("/login");
        else setUser(data.user);
      });

    fetch("/api/download/history", { credentials: "include" })
      .then(res => res.json())
      .then(data => setDescargas(data));
  }, []);

  return (
    <div className="max-w-3xl mx-auto pt-32 px-6 bg-white dark:bg-[#111] min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Mis Descargas
      </h1>

      {descargas.length === 0 && (
        <p className="text-gray-700 dark:text-gray-300">
          No has descargado nada todavía.
        </p>
      )}

      {descargas.map(d => (
        <div
          key={d.id}
          className="bg-white dark:bg-[#1a1a1a] shadow p-4 rounded mb-4 border border-gray-200 dark:border-gray-700"
        >
          <p className="text-gray-700 dark:text-gray-300">
            <strong className="text-gray-900 dark:text-gray-100">Plugin:</strong> {d.plugin_nombre}
          </p>

          <p className="text-gray-700 dark:text-gray-300">
            <strong className="text-gray-900 dark:text-gray-100">Fecha:</strong> {d.fecha}
          </p>
        </div>
      ))}
    </div>
  );
}
