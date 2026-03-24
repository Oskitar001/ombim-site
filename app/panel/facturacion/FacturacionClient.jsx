// /app/panel/facturacion/FacturacionClient.jsx
"use client";

import { useState } from "react";

export default function FacturacionClient({ user_id, datosIniciales }) {
  const [form, setForm] = useState({
    nombre: datosIniciales?.nombre ?? "",
    nif: datosIniciales?.nif ?? "",
    direccion: datosIniciales?.direccion ?? "",
    ciudad: datosIniciales?.ciudad ?? "",
    cp: datosIniciales?.cp ?? "",
    pais: datosIniciales?.pais ?? "",
    telefono: datosIniciales?.telefono ?? "",
  });

  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  async function guardar() {
    setMsg("");
    setError("");

    const res = await fetch("/api/facturacion/guardar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id, ...form }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Error guardando datos");
    } else {
      setMsg("Datos guardados correctamente.");
    }
  }

  return (
    <div className="space-y-4 max-w-lg">
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
            value={form[key]}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, [key]: e.target.value }))
            }
            className="border p-2 rounded w-full"
          />
        </div>
      ))}

      <button
        onClick={guardar}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Guardar datos
      </button>

      {msg && <p className="text-green-600">{msg}</p>}
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
}