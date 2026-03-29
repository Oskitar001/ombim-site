"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Upload } from "lucide-react";

export default function NuevoPluginPage() {
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precio: 0,
    precio_anual: 0,
    precio_completa: 0,
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

      {/* VOLVER */}
      <Link
        href="/panel/admin/plugins"
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
      >
        <ArrowLeft size={20} /> Volver
      </Link>

      {/* TÍTULO */}
      <h1 className="text-3xl font-bold">Nuevo Plugin</h1>

      {/* FORM CARD PREMIUM */}
      <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow rounded-xl p-6 space-y-6">

        {/* Nombre */}
        <Field label="Nombre">
          <input
            className="input-premium"
            value={form.nombre}
            onChange={(e) => update("nombre", e.target.value)}
          />
        </Field>

        {/* Descripción */}
        <Field label="Descripción">
          <textarea
            className="input-premium"
            rows={4}
            value={form.descripcion}
            onChange={(e) => update("descripcion", e.target.value)}
          />
        </Field>

        {/* Precio */}
        <Field label="Precio por defecto (€)">
          <input
            type="number"
            className="input-premium"
            value={form.precio}
            onChange={(e) => update("precio", e.target.value)}
          />
        </Field>

        <Field label="Precio anual (€)">
          <input
            type="number"
            className="input-premium"
            value={form.precio_anual}
            onChange={(e) => update("precio_anual", e.target.value)}
          />
        </Field>

        <Field label="Precio completa (€)">
          <input
            type="number"
            className="input-premium"
            value={form.precio_completa}
            onChange={(e) => update("precio_completa", e.target.value)}
          />
        </Field>

        {/* Archivo TSEP */}
        <Field label="Archivo (.tsep)">
          <input
            type="file"
            accept=".tsep"
            className="input-premium"
            onChange={subirTsep}
          />
          {form.archivo_url && (
            <p className="text-green-600 text-sm mt-1">
              Archivo subido correctamente
            </p>
          )}
        </Field>

        {/* Video */}
        <Field label="Video URL (YouTube)">
          <input
            className="input-premium"
            value={form.video_url}
            onChange={(e) => update("video_url", e.target.value)}
          />
        </Field>

        {/* Imagen */}
        <Field label="Imagen del plugin">
          <input
            type="file"
            accept="image/*"
            className="input-premium"
            onChange={subirImagen}
          />
          {form.imagen_url && (
            <p className="text-green-600 text-sm mt-1">
              Imagen subida correctamente
            </p>
          )}
        </Field>

        {/* Botón Guardar */}
        <button
          onClick={guardar}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 shadow text-lg font-semibold"
        >
          Guardar Plugin
        </button>
      </div>
    </div>
  );
}

/* ============================
   COMPONENTE PREMIUM FIELD
============================ */
function Field({ label, children }) {
  return (
    <div className="space-y-1">
      <label className="font-semibold">{label}</label>
      {children}
    </div>
  );
}

/* ============================
   ESTILOS PREMIUM INPUT
============================ */
/* Usar Tailwind con clases reutilizables */