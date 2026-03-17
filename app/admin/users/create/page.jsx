"use client";

import { useState } from "react";

export default function UserCreatePage() {
  const [email, setEmail] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    await fetch("/api/admin/usuario", {
      method: "POST",
      body: JSON.stringify({ email })
    });

    alert("Usuario creado");
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Crear usuario</h1>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <button type="submit">Crear</button>
      </form>
    </div>
  );
}
