"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NuevoPluginPage() {
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precio: 0,

    // ✅ NUEVO
    precio_trimestral: 0,
    precio_anual: 0,
    precio_completa: 0,

    permite_trimestral: false,
    permite_anual: false,
    permite_completa: false,

    archivo_url: "",
    video_url: "",
    imagen_url: "",
  });

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // ================================
  // SUBIR IMAGEN
  // ================================
  async function subirImagen(e) {
    const file = e.target.files[0];
    if (!file) return;

    const ext = file.name.split(".").pop();
    const name = `${Date.now()}.${ext}`;

    const res = await fetch(`/api/admin/upload-image?name=${name}`, {
      method: "POST",
      credentials: "include",
      body: file,
    });

    const json = await res.json();
    if (!json?.url) {
      alert("Error subiendo la imagen");
      return;
    }

    update("imagen_url", json.url);
  }

  // ================================
  // SUBIR TSEP
  // ================================
  async function subirTsep(e) {
    const file = e.target.files[0];
    if (!file) return;

    const ext = file.name.split(".").pop();
    if (ext !== "tsep") {
      alert("El archivo debe ser .tsep");
      return;
    }

    const name = `${Date.now()}.${ext}`;

    const res = await fetch(`/api/admin/upload-tsep?name=${name}`, {
      method: "POST",
      credentials: "include",
      body: file,
    });

    const json = await res.json();
    if (!json?.url) {
      alert("Error subiendo el archivo TSEP");
      return;
    }

    update("archivo_url", json.url);
  }

  // ================================
  // GUARDAR PLUGIN
  // ================================
  async function guardar() {
    const payload = {
      ...form,
      precio: Number(form.precio) || 0,
      precio_trimestral: Number(form.precio_trimestral) || 0,
      precio_anual: Number(form.precio_anual) || 0,
      precio_completa: Number(form.precio_completa) || 0,
    };

    const res = await fetch("/api/admin/plugins/nuevo", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = await res.json();

    if (!res.ok) {
      alert(json.error ?? "Error guardando plugin");
      return;
    }

    window.location.href = "/panel/admin/plugins";
  }

  return (
    <div className="space-y-8 p-4 max-w-2xl mx-auto">

      <Link
        href="/panel/admin/plugins"
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
      >
        <ArrowLeft size={20} /> Volver
      </Link>

      <h1 className="text-3xl font-bold">Nuevo Plugin</h1>

      <div className="bg-white dark:bg-gray-900 border shadow rounded-xl p-6 space-y-6">

        <Field label="Nombre">
          <input className="input-premium" value={form.nombre} onChange={(e) => update("nombre", e.target.value)} />
        </Field>

        <Field label="Descripción">
          <textarea className="input-premium" rows={4} value={form.descripcion} onChange={(e) => update("descripcion", e.target.value)} />
        </Field>

       {/* TIPOS DE LICENCIA */}
<div className="space-y-4">
  <label className="font-semibold">Tipos de licencia disponibles</label>

  {/* TRIMESTRAL */}
  <div className="flex items-center justify-between gap-4 border p-3 rounded">
    <label className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={form.permite_trimestral}
        onChange={(e) => update("permite_trimestral", e.target.checked)}
      />
      <span>Trimestral</span>
    </label>

    <input
      type="number"
      placeholder="Precio (€)"
      className="input-premium w-32"
      value={form.precio_trimestral}
      disabled={!form.permite_trimestral}
      onChange={(e) => update("precio_trimestral", e.target.value)}
    />
  </div>

  {/* ANUAL */}
  <div className="flex items-center justify-between gap-4 border p-3 rounded">
    <label className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={form.permite_anual}
        onChange={(e) => update("permite_anual", e.target.checked)}
      />
      <span>Anual</span>
    </label>

    <input
      type="number"
      placeholder="Precio (€)"
      className="input-premium w-32"
      value={form.precio_anual}
      disabled={!form.permite_anual}
      onChange={(e) => update("precio_anual", e.target.value)}
    />
  </div>

  {/* COMPLETA */}
  <div className="flex items-center justify-between gap-4 border p-3 rounded">
    <label className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={form.permite_completa}
        onChange={(e) => update("permite_completa", e.target.checked)}
      />
      <span>Completa</span>
    </label>

    <input
      type="number"
      placeholder="Precio (€)"
      className="input-premium w-32"
      value={form.precio_completa}
      disabled={!form.permite_completa}
      onChange={(e) => update("precio_completa", e.target.value)}
    />
  </div>
</div>
        <Field label="Archivo (.tsep)">
          <input type="file" accept=".tsep" onChange={subirTsep} />
        </Field>

        <Field label="Video URL">
          <input className="input-premium" value={form.video_url} onChange={(e) => update("video_url", e.target.value)} />
        </Field>

        <Field label="Imagen">
          <input type="file" accept="image/*" onChange={subirImagen} />
        </Field>

        <button onClick={guardar} className="w-full bg-blue-600 text-white py-3 rounded-lg">
          Guardar Plugin
        </button>

      </div>
    </div>
  );
}

/* COMPONENTE FIELD */
function Field({ label, children }) {
  return (
    <div className="space-y-1">
      <label className="font-semibold">{label}</label>
      {children}
    </div>
  );
}