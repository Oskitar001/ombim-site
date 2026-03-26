"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NuevoPluginPage() {
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precio: 0,
    archivo_url: "",
    video_url: "",
    imagen_url: "",
  });

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // ==========================
  // SUBIR IMAGEN A SUPABASE
  // ==========================
  async function subirImagen(e) {
    const file = e.target.files[0];
    if (!file) return;

    const ext = file.name.split(".").pop();
    const name = `${Date.now()}.${ext}`;

    const upload = await fetch(`/api/admin/upload-image?name=${name}`, {
      method: "POST",
      body: file,
    });

    const json = await upload.json();
    update("imagen_url", json.url);
  }

  // ==========================
  // SUBIR PLUGIN .TSEP
  // ==========================
  async function subirTsep(e) {
    const file = e.target.files[0];
    if (!file) return;

    const ext = file.name.split(".").pop();
    if (ext !== "tsep") {
      alert("El archivo debe ser .tsep");
      return;
    }

    const name = `${Date.now()}.${ext}`;

    const upload = await fetch(`/api/admin/upload-tsep?name=${name}`, {
      method: "POST",
      body: file,
    });

    const json = await upload.json();
    update("archivo_url", json.url);
  }

  // ==========================
  // GUARDAR PLUGIN EN SUPABASE
  // ==========================
  async function guardar() {
    await fetch("/api/admin/plugins/nuevo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

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

        {/* Precio */}
        <div>
          <label>Precio (€)</label>
          <input
            type="number"
            className="w-full p-2 rounded border dark:bg-gray-900"
            value={form.precio}
            onChange={(e) => update("precio", parseFloat(e.target.value))}
          />
        </div>

        {/* Subir archivo TSEP */}
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

        {/* Subir imagen */}
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

        {/* Guardar */}
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