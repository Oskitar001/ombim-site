"use client";

import { useEffect, useState } from "react";

export default function AdminUsersList() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);

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

    // Cargar usuarios desde API admin
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  if (!user) return <p>Cargando...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Usuarios</h1>

      <table style={{ width: "100%", marginTop: "1rem" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Nombre</th>
            <th>Rol</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.email}</td>
              <td>{u.nombre}</td>
              <td>{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
