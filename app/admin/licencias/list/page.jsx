"use client";

import { useEffect, useState } from "react";

export default function AdminLicenciasList() {
  const [user, setUser] = useState(null);
  const [licencias, setLicencias] = useState([]);

  useEffect(() => {
    // Leer cookie session
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("session="));

    if (!cookie) {
      window.location.href = "/login";
      return;
    }

    const session = JSON.parse(decodeURIComponent(cookie.split("=")[1]));

    // Si no es admin → fuera
    if (session.role !== "admin") {
      window.location.href = "/dashboard";
      return;
    }

    setUser(session);

    // Cargar licencias desde API admin
    fetch("/api/admin/licencias")
      .then((res) => res.json())
      .then((data) => setLicencias(data));
  }, []);

  if (!user) return <p>Cargando...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Licencias</h1>

      <table style={{ width: "100%", marginTop: "1rem" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Código</th>
            <th>Estado</th>
            <th>Usuario</th>
          </tr>
        </thead>

        <tbody>
          {licencias.map((l) => (
            <tr key={l.id}>
              <td>{l.id}</td>
              <td>{l.codigo}</td>
              <td>{l.estado}</td>
              <td>{l.usuario_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
