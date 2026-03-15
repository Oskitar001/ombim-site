"use client";

import { useEffect } from "react";

export default function LogoutEmpresa() {
  useEffect(() => {
    fetch("/api/empresa/logout", { method: "POST" }).then(() => {
      window.location.href = "/empresa/login";
    });
  }, []);

  return <p>Cerrando sesión...</p>;
}
