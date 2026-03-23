"use client";

import { useState } from "react";

export default function FacturacionClient({ user_id, datosIniciales }) {
  const [form, setForm] = useState({
    nombre: datosIniciales?.nombre || "",
    nif: datosIniciales?.nif || "",
    direccion: datosIniciales?.direccion || "",
    ciudad: datosIniciales?.ciudad || "",
    cp: datosIniciales?.cp || "",
    pais: datosIniciales?.pais || "",
    telefono: datosIniciales?.telefono || "",
  });

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const update = (campo, valor) => {
    setForm({ ...form, [campo]: valor });
  };

  const guardar = async () => {
    setMensaje("");
    setError("");

    const res = await fetch("/api/facturacion/guardar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id, ...form }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Error guardando datos");
      return;
    }

    setMensaje("Datos guardados correctamente.");
  };

  return (
    <div className="space-y-4">
      {[
        ["nombre", "Nombre o empresa"],
        ["nif", "NIF / CIF"],
        ["direccion", "Dirección"],
        ["ciudad", "Ciudad"],
        ["cp", "Código postal"],
        ["pais", "País"],
        ["telefono", "Teléfono"],
      ].map(([campo, label]) => (
        <div key={campo}>
          <label className="block mb-1 font-medium">{label}</label>
          <input
            type="text"
            value={form[campo]}
            onChange={(e) => update(campo, e.target.value)}
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

      {mensaje && <p className="text-green-600 mt-3">{mensaje}</p>}
      {error && <p className="text-red-600 mt-3">{error}</p>}
    </div>
  );
}
