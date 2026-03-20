"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PanelLogs() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        if (!data.user) {
          router.push("/login");
          return;
        }

        setUser(data.user);

        fetch(`/api/logs/user/${data.user.id}`)
          .then(res => res.json())
          .then(data => setLogs(data || []));
      });
  }, [router]);

  if (!user) return <p className="pt-32 text-center">Cargando...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Mis Logs</h1>

      <table style={{ width: "100%", marginTop: "1rem" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Acción</th>
            <th>IP</th>
            <th>Fecha</th>
          </tr>
        </thead>

        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td>{log.id}</td>
              <td>{log.accion}</td>
              <td>{log.ip}</td>
              <td>{log.fecha}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
