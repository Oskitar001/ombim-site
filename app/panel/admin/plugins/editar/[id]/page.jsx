"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function EditarPluginPage() {
  const { id } = useParams();

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

  const [loading, setLoading] = useState(true);

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  /* ===========================
     CARGAR DATOS DEL PLUGIN
  ============================ */
  useEffect(() => {
    async function load() {
      const r = await fetch(`/api/admin/plugins/${id}`, {
        credentials: "include",
      });

      const d = await r.json();

      if (!r.ok) {
        alert(d.error ?? "Error cargando plugin");
        return;
      }

      setForm({
        nombre: d.nombre ?? "",
        descripcion: d.descripcion ?? "",
        precio: d.precio ?? 0,
        precio_anual: d.precio_anual ?? 0,
        precio_completa: d.precio_completa ?? 0,
        archivo_url: d.archivo_url ?? "",
        video_url: d.video_url ?? "",
        imagen_url: d.imagen_url ?? "",
      });

      setLoading(false);
    }

    load();
  }, [id]);

  /* ===========================
     SUBIR IMAGEN
  ============================ */
  async function subirImagen(e) {
    const file = e.target.files?.[0];
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
      alert("Error subiendo imagen");
      return;
    }

    update("imagen_url", json.url);
  }

  /* ===========================
     SUBIR TSEP
  ============================ */
  async function subirTsep(e) {
    const file = e.target.files?.[0];
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
      alert("Error subiendo archivo TSEP");
      return;
    }

    update("archivo_url", json.url);
  }

  /* ===========================
     GUARDAR CAMBIOS
  ============================ */
  async function guardar() {
    const payload = {
      ...form,
      precio: Number(form.precio) || 0,
      precio_anual: Number(form.precio_anual) || 0,
      precio_completa: Number(form.precio_completa) || 0,
    };

    const r = await fetch(`/api/admin/plugins/editar/${id}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const d = await r.json();

    if (!r.ok) {
      alert(d.error ?? "Error guardando cambios");
      return;
    }

    window.location.href = "/panel/admin/plugins";
  }

  if (loading) return <p className="p-4">Cargando plugin…</p>;

  /* ===========================
     UI PREMIUM
  ============================ */
  return (
    <div className="space-y-8 p-4 max-w-2xl mx-auto">

      {/* Volver */}
      <Link
        href="/panel/admin/plugins"
        className="flex items-center gap-2 text-blue-600 hover:underline"
      >
        <ArrowLeft size={20} /> Volver
      </Link>

      <h1 className="text-3xl font-bold">Editar Plugin</h1>

      <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow rounded-xl p-6 space-y-6">

        <Field label="Nombre">
          <input
            className="input-premium"
            value={form.nombre}
            onChange={(e) => update("nombre", e.target.value)}
          />
        </Field>

        <Field label="Descripción">
          <textarea
            rows={4}
            className="input-premium"
            value={form.descripcion}
            onChange={(e) => update("descripcion", e.target.value)}
          />
        </Field>

        <Field label="Precio (€)">
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

        <Field label="Archivo (.tsep)">
          <input
            type="file"
            accept=".tsep"
            className="input-premium"
            onChange={subirTsep}
          />
          {form.archivo_url && (
            <p className="text-green-600 text-sm mt-1">Archivo subido ✓</p>
          )}
        </Field>

        <Field label="Video URL (YouTube)">
          <input
            className="input-premium"
            value={form.video_url}
            onChange={(e) => update("video_url", e.target.value)}
          />
        </Field>

        <Field label="Imagen del plugin">
          <input
            type="file"
            accept="image/*"
            className="input-premium"
            onChange={subirImagen}
          />

          {form.imagen_url && (
            <img
              src={form.imagen_url}
              className="w-32 h-32 object-cover mt-2 rounded shadow"
            />
          )}
        </Field>

        <button
          onClick={guardar}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 shadow text-lg font-semibold"
        >
          Guardar Cambios
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-1">
      <label className="font-semibold">{label}</label>
      {children}
    </div>
  );
}
