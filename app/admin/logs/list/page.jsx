"use client";

import { useEffect, useState } from "react";

export default function AdminLogsList() {
  const [user, setUser] = useState(null);
  const [logs, setLogs] = useState([]);

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

    // Cargar logs desde API admin
    fetch("/api/admin/logs")
      .then((res) => res.json())
      .then((data) => setLogs(data));
  }, []);

  if (!user) return <p>Cargando...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Logs del Sistema</h1>

      <table style={{ width: "100%", marginTop: "1rem" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Acción</th>
            <th>Usuario</th>
            <th>IP</th>
            <th>Fecha</th>
          </tr>
        </thead>

        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td>{log.id}</td>
              <td>{log.accion}</td>
              <td>{log.usuario_id}</td>
              <td>{log.ip}</td>
              <td>{log.fecha}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
