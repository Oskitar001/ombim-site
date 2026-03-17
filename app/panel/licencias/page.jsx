"use client";

import { useEffect, useState } from "react";

export default function PanelLicencias() {
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
    setUser(session);

    // Cargar licencias del usuario
    fetch(`/api/licencias/user/${session.id}`)
      .then((res) => res.json())
      .then((data) => setLicencias(data));
  }, []);

  if (!user) return <p>Cargando...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Mis Licencias</h1>

      <table style={{ width: "100%", marginTop: "1rem" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Código</th>
            <th>Estado</th>
          </tr>
        </thead>

        <tbody>
          {licencias.map((l) => (
            <tr key={l.id}>
              <td>{l.id}</td>
              <td>{l.codigo}</td>
              <td>{l.estado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
