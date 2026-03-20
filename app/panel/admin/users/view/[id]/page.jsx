"use client";

import { useEffect, useState } from "react";

export default function UserViewPage({ params }) {
  const { id } = params;
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function cargar() {
      const res = await fetch(`/api/admin/usuario/${id}`);
      const data = await res.json();
      setUser(data);
    }
    cargar();
  }, [id]);

  if (!user) return <p>Cargando...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Usuario: {user.email}</h1>

      <p><strong>ID:</strong> {user.id}</p>
      <p><strong>Nombre:</strong> {user.nombre || "—"}</p>

      <h2 className="text-xl font-bold mt-6 mb-2">Licencias</h2>
      <ul className="list-disc ml-6">
        {user.licencias?.map((l) => (
          <li key={l.id}>
            <a href={`/panel/admin/licencias/${l.id}`} className="text-blue-600">
              {l.codigo} — {l.estado}
            </a>
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold mt-6 mb-2">Pagos</h2>
      <ul className="list-disc ml-6">
        {user.pagos?.map((p) => (
          <li key={p.id}>
            {p.estado} — {new Date(p.fecha).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
