"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

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
      credentials: "include", // 🔥 FIX
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
      credentials: "include", // 🔥 FIX
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
      credentials: "include", // 🔥 FIX
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
    <div className="space-y-6 p-4 max-w-xl mx-auto">
      <Link href="/panel/admin/plugins" className="flex items-center gap-2">
        <ArrowLeft size={20} /> Volver
      </Link>

      <h1 className="text-3xl font-bold">Nuevo Plugin</h1>

      <div className="space-y-4">
        {/* Nombre */}
        <div>
          <label>Nombre</label>
          <input
            className="w-full p-2 rounded border dark:bg-gray-900"
            value={form.nombre}
            onChange={(e) => update("nombre", e.target.value)}
          />
        </div>

        {/* Descripción */}
        <div>
          <label>Descripción</label>
          <textarea
            className="w-full p-2 rounded border dark:bg-gray-900"
            rows={4}
            value={form.descripcion}
            onChange={(e) => update("descripcion", e.target.value)}
          />
        </div>

        {/* Precio por defecto */}
        <div>
          <label>Precio por defecto (€)</label>
          <input
            type="number"
            className="w-full p-2 rounded border dark:bg-gray-900"
            value={form.precio}
            onChange={(e) => update("precio", e.target.value)}
          />
        </div>

        {/* Precio anual */}
        <div>
          <label>Precio Anual (€)</label>
          <input
            type="number"
            className="w-full p-2 rounded border dark:bg-gray-900"
            value={form.precio_anual}
            onChange={(e) => update("precio_anual", e.target.value)}
          />
        </div>

        {/* Precio completa */}
        <div>
          <label>Precio Completa (€)</label>
          <input
            type="number"
            className="w-full p-2 rounded border dark:bg-gray-900"
            value={form.precio_completa}
            onChange={(e) => update("precio_completa", e.target.value)}
          />
        </div>

        {/* Archivo TSEP */}
        <div>
          <label>Archivo (.tsep)</label>
          <input
            type="file"
            accept=".tsep"
            className="w-full p-2 rounded border dark:bg-gray-900"
            onChange={subirTsep}
          />
          {form.archivo_url && (
            <p className="text-green-600 text-sm">Archivo subido correctamente</p>
          )}
        </div>

        {/* Video */}
        <div>
          <label>Video URL (YouTube)</label>
          <input
            className="w-full p-2 rounded border dark:bg-gray-900"
            value={form.video_url}
            onChange={(e) => update("video_url", e.target.value)}
          />
        </div>

        {/* Imagen */}
        <div>
          <label>Imagen del plugin</label>
          <input
            type="file"
            accept="image/*"
            className="w-full p-2 rounded border dark:bg-gray-900"
            onChange={subirImagen}
          />
          {form.imagen_url && (
            <p className="text-green-600 text-sm">Imagen subida correctamente</p>
          )}
        </div>

        <button
          onClick={guardar}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
        >
          Guardar Plugin
        </button>
      </div>
    </div>
  );
}