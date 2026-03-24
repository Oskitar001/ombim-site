// /app/panel/mis-descargas/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function MisDescargas() {
  const [user, setUser] = useState(null);
  const [descargas, setDescargas] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (!data.user) router.push("/login");
        else setUser(data.user);
      });

    fetch("/api/download/history")
      .then((res) => res.json())
      .then((data) => setDescargas(data ?? []));
  }, [router]);

  if (!user) return <p>Cargando…</p>;

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Mis descargas</h1>

      {!descargas.length && <p>No has descargado nada todavía.</p>}

      {descargas.map((d) => (
        <div key={d.id}>
          <p><strong>Plugin:</strong> {d.plugin_nombre}</p>
          <p><strong>Fecha:</strong> {d.fecha}</p>
        </div>
      ))}
    </div>
  );
}