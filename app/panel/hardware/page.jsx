"use client";

import { useEffect, useState } from "react";

export default function PanelHardware() {
  const [user, setUser] = useState(null);
  const [hardware, setHardware] = useState([]);

  useEffect(() => {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("session="));

    if (!cookie) {
      window.location.href = "/login";
      return;
    }

    const session = JSON.parse(decodeURIComponent(cookie.split("=")[1]));
    setUser(session);

    fetch(`/api/hardware/user/${session.id}`)
      .then((res) => res.json())
      .then((data) => setHardware(data));
  }, []);

  if (!user) return <p>Cargando...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Mi Hardware</h1>

      <table style={{ width: "100%", marginTop: "1rem" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>CPU</th>
            <th>GPU</th>
            <th>RAM</th>
            <th>Fecha</th>
          </tr>
        </thead>

        <tbody>
          {hardware.map((h) => (
            <tr key={h.id}>
              <td>{h.id}</td>
              <td>{h.cpu}</td>
              <td>{h.gpu}</td>
              <td>{h.ram}</td>
              <td>{h.fecha}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
