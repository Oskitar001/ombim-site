// /app/panel/mis-datos/MisDatosClient.jsx
"use client";

import { useState } from "react";

export default function MisDatosClient({ initialData }) {
  const [form, setForm] = useState({
    nombre: initialData?.nombre ?? "",
    nif: initialData?.nif ?? "",
    direccion: initialData?.direccion ?? "",
    ciudad: initialData?.ciudad ?? "",
    cp: initialData?.cp ?? "",
    pais: initialData?.pais ?? "",
    telefono: initialData?.telefono ?? "",
  });

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    setError("");

    const res = await fetch("/api/facturacion/guardar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Error guardando datos");
    } else {
      setMsg("Datos guardados correctamente.");
    }

    setSaving(false);
  }

  return (
    <form onSubmit={submit} className="space-y-4 max-w-lg">
      {Object.entries({
        nombre: "Nombre o empresa",
        nif: "NIF / CIF",
        direccion: "Dirección",
        ciudad: "Ciudad",
        cp: "Código postal",
        pais: "País",
        telefono: "Teléfono",
      }).map(([key, label]) => (
        <div key={key}>
          <label className="block mb-1">{label}</label>
          <input
            type="text"
            name={key}
            value={form[key]}
            onChange={(e) =>
              setForm((f) => ({ ...f, [key]: e.target.value }))
            }
            className="border p-2 rounded w-full"
          />
        </div>
      ))}

      <button className="bg-blue-600 text-white px-4 py-2 rounded">
        {saving ? "Guardando…" : "Guardar datos"}
      </button>

      {msg && <p className="text-green-600">{msg}</p>}
      {error && <p className="text-red-600">{error}</p>}
    </form>
  );
}