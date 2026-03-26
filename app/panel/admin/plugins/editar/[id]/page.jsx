"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function EditarPluginPage({ params }) {
  const { id } = use(params);

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precio: 0,
    archivo_url: "",
    video_url: "",
    imagen_url: "",
  });

  const [loading, setLoading] = useState(true);

  function update(k, v) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  // Cargar datos del plugin real
  useEffect(() => {
    async function load() {
      const r = await fetch(`/api/plugin/${id}`);
      const d = await r.json();

      setForm({
        nombre: d.nombre,
        descripcion: d.descripcion,
        precio: d.precio,
        archivo_url: d.archivo_url,
        video_url: d.video_url,
        imagen_url: d.imagen_url,
      });

      setLoading(false);
    }
    load();
  }, [id]);

  // Subir imagen
  async function subirImagen(e) {
    const file = e.target.files[0];
    if (!file) return;

    const name = file.name;

    const upload = await fetch(`/api/admin/upload-image?name=${name}`, {
      method: "POST",
      body: file,
    });

    const json = await upload.json();
    update("imagen_url", json.url);
  }

  // Subir TSEP con nombre original
  async function subirTsep(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith(".tsep")) {
      alert("Debe ser un archivo .tsep");
      return;
    }

    const name = file.name;

    const upload = await fetch(`/api/admin/upload-tsep?name=${name}`, {
      method: "POST",
      body: file,
    });

    const json = await upload.json();
    update("archivo_url", json.url);
  }

  // Guardar cambios
  async function guardar() {
    await fetch("/api/admin/plugins/editar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...form }),
    });

    window.location.href = "/panel/admin/plugins";
  }

  // Notificar versión
  async function notificarVersion() {
    if (!form.archivo_url) {
      alert("Primero sube un archivo .tsep");
      return;
    }

    const archivo_nombre = form.archivo_url.split("/").pop();

    const res = await fetch("/api/admin/plugins/notificar-version", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plugin_id: id, archivo_nombre }),
    });

    const data = await res.json();

    alert(`Notificados ${data.enviados} usuarios`);
  }

  if (loading) return <p className="mt-10">Cargando...</p>;

  return (
    <div className="space-y-6 p-4 max-w-xl mx-auto">
      <Link href="/panel/admin/plugins" className="flex items-center gap-2">
        <ArrowLeft size={20} /> Volver
      </Link>

      <h1 className="text-3xl font-bold">Editar Plugin</h1>

      <div className="space-y-4">

        <div>
          <label>Nombre</label>
          <input
            className="w-full p-2 rounded border dark:bg-gray-900"
            value={form.nombre}
            onChange={(e) => update("nombre", e.target.value)}
          />
        </div>

        <div>
          <label>Descripción</label>
          <textarea
            className="w-full p-2 rounded border dark:bg-gray-900"
            rows={4}
            value={form.descripcion}
            onChange={(e) => update("descripcion", e.target.value)}
          />
        </div>

        <div>
          <label>Precio (€)</label>
          <input
            type="number"
            className="w-full p-2 rounded border dark:bg-gray-900"
            value={form.precio}
            onChange={(e) => update("precio", Number(e.target.value))}
          />
        </div>

        {/* TSEP */}
        <div>
          <label>Archivo del plugin (.tsep)</label>
          <input
            type="file"
            accept=".tsep"
            className="w-full p-2 rounded border dark:bg-gray-900"
            onChange={subirTsep}
          />

          {form.archivo_url && (
            <p className="text-sm text-green-600">
              Archivo actual: {form.archivo_url.split("/").pop()}
            </p>
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
        </div>

        {/* BOTONES */}
        <button
          onClick={guardar}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
        >
          Guardar cambios
        </button>

        <button
          onClick={notificarVersion}
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
        >
          Notificar nueva versión a compradores
        </button>
      </div>
    </div>
  );
}