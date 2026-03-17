"use client";

import { useEffect, useState } from "react";

export default function PanelDashboard() {
  const [user, setUser] = useState(null);

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

    // Guardar usuario
    setUser(session);
  }, []);

  if (!user) return <p>Cargando...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Bienvenido {user.nombre}</h1>
      <p>Este es tu panel de usuario.</p>
    </div>
  );
}
