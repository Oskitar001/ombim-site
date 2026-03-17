"use client";

import { useState } from "react";

export default function LicenseCreatePage() {
  const [form, setForm] = useState({
    user_id: "",
    tipo_id: "",
    codigo: "",
    fecha_expiracion: "",
    max_activaciones: 3,
    notas: ""
  });

  async function handleSubmit(e) {
    e.preventDefault();

    await fetch("/api/admin/licencias", {
      method: "POST",
      body: JSON.stringify(form)
    });

    alert("Licencia creada");
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Crear licencia</h1>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="User ID"
          onChange={(e) => setForm({ ...form, user_id: e.target.value })}
        />

        <input
          placeholder="Tipo ID"
          onChange={(e) => setForm({ ...form, tipo_id: e.target.value })}
        />

        <input
          placeholder="Código"
          onChange={(e) => setForm({ ...form, codigo: e.target.value })}
        />

        <button type="submit">Crear</button>
      </form>
    </div>
  );
}
