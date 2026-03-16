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
    <div className="max-w-3xl mx-auto pt-32 px-6">
      <h1 className="text-3xl font-bold mb-6">Mis Descargas</h1>

      {descargas.length === 0 && <p>No has descargado nada todavía.</p>}

      {descargas.map(d => (
        <div key={d.id} className="bg-white shadow p-4 rounded mb-4">
          <p><strong>Plugin:</strong> {d.plugin_nombre}</p>
          <p><strong>Fecha:</strong> {d.fecha}</p>
        </div>
      ))}
    </div>
  );
}
