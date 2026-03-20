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
    <div className="max-w-3xl mx-auto pt-32 px-6 bg-[#f3f4f6]Soft dark:bg-[#242424] min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-[#1f2937] dark:text-[#e6e6e6]">
        Mis Descargas
      </h1>

      {descargas.length === 0 && (
        <p className="text-[#1f2937] dark:text-[#e6e6e6]">
          No has descargado nada todavía.
        </p>
      )}

      {descargas.map(d => (
        <div
          key={d.id}
          className="bg-[#f3f4f6]Soft dark:bg-[#1a1a1a] shadow p-4 rounded mb-4 border border-[#d1d5db] dark:border-[#3a3a3a]"
        >
          <p className="text-[#1f2937] dark:text-[#e6e6e6]">
            <strong className="text-[#1f2937] dark:text-[#e6e6e6]">Plugin:</strong> {d.plugin_nombre}
          </p>

          <p className="text-[#1f2937] dark:text-[#e6e6e6]">
            <strong className="text-[#1f2937] dark:text-[#e6e6e6]">Fecha:</strong> {d.fecha}
          </p>
        </div>
      ))}
    </div>
  );
}
