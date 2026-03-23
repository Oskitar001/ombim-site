"use client";

import { useState } from "react";

export default function MisDatosClient({ initialData }) {
  const [form, setForm] = useState({
    nombre: initialData?.nombre || "",
    nif: initialData?.nif || "",
    direccion: initialData?.direccion || "",
    ciudad: initialData?.ciudad || "",
    cp: initialData?.cp || "",
    pais: initialData?.pais || "",
    telefono: initialData?.telefono || "",
  });
  const [saving, setSaving] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const onChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMensaje("");
    setError("");

    const res = await fetch("/api/facturacion/guardar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error || "Error guardando datos de facturación");
      return;
    }

    setMensaje("Datos de facturación guardados correctamente.");
  };

  return (
    <form onSubmit={onSubmit} className="bg-white shadow border border-gray-200 rounded p-6 space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Nombre / Razón social</label>
        <input
          name="nombre"
          value={form.nombre}
          onChange={onChange}
          className="w-full border rounded px-3 py-2 text-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">NIF / CIF</label>
        <input
          name="nif"
          value={form.nif}
          onChange={onChange}
          className="w-full border rounded px-3 py-2 text-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Dirección</label>
        <input
          name="direccion"
          value={form.direccion}
          onChange={onChange}
          className="w-full border rounded px-3 py-2 text-sm"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Ciudad</label>
          <input
            name="ciudad"
            value={form.ciudad}
            onChange={onChange}
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">CP</label>
          <input
            name="cp"
            value={form.cp}
            onChange={onChange}
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">País</label>
          <input
            name="pais"
            value={form.pais}
            onChange={onChange}
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Teléfono</label>
        <input
          name="telefono"
          value={form.telefono}
          onChange={onChange}
          className="w-full border rounded px-3 py-2 text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-60"
      >
        {saving ? "Guardando..." : "Guardar datos"}
      </button>

      {mensaje && <p className="text-green-600 text-sm mt-2">{mensaje}</p>}
      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
    </form>
  );
}
