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

  const [loading, setLoading] = useState(true);

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // ===========================
  // CARGAR PLUGIN
  // ===========================
  useEffect(() => {
    async function load() {
      const r = await fetch(`/api/admin/plugins/${id}`, {
        credentials: "include",
      });

      const d = await r.json();
      const p = d.plugin;

      setForm({
        nombre: p.nombre ?? "",
        descripcion: p.descripcion ?? "",

        precio_trimestral: p.precio_trimestral ?? 0,
        precio_anual: p.precio_anual ?? 0,
        precio_completa: p.precio_completa ?? 0,

        permite_trimestral: p.permite_trimestral ?? false,
        permite_anual: p.permite_anual ?? false,
        permite_completa: p.permite_completa ?? false,

        archivo_url: p.archivo_url ?? "",
        video_url: p.video_url ?? "",
        imagen_url: p.imagen_url ?? "",
      });

      setLoading(false);
    }

    load();
  }, [id]);

  // ===========================
  // SUBIR IMAGEN
  // ===========================
  async function subirImagen(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const name = `${Date.now()}.${file.name.split(".").pop()}`;

    const res = await fetch(`/api/admin/upload-image?name=${name}`, {
      method: "POST",
      credentials: "include",
      body: file,
    });

    const json = await res.json();
    update("imagen_url", json.url);
  }

  // ===========================
  // SUBIR TSEP
  // ===========================
  async function subirTsep(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const name = `${Date.now()}.${file.name.split(".").pop()}`;

    const res = await fetch(`/api/admin/upload-tsep?name=${name}`, {
      method: "POST",
      credentials: "include",
      body: file,
    });

    const json = await res.json();
    update("archivo_url", json.url);
  }

  // ===========================
  // VIDEO PREVIEW
  // ===========================
  function getYoutubeId(url) {
    if (!url) return null;
    const m1 = url.match(/v=([^&]+)/);
    const m2 = url.match(/youtu\.be\/([^?]+)/);
    return m1 ? m1[1] : m2 ? m2[1] : null;
  }

  const videoId = getYoutubeId(form.video_url);

  // ===========================
  // GUARDAR
  // ===========================
  async function guardar() {
    const payload = {
      ...form,
      precio_trimestral: Number(form.precio_trimestral) || 0,
      precio_anual: Number(form.precio_anual) || 0,
      precio_completa: Number(form.precio_completa) || 0,
    };

    const r = await fetch(`/api/admin/plugins/editar/${id}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (r.ok) window.location.href = "/panel/admin/plugins";
  }

  if (loading) return <p className="p-4">Cargando plugin…</p>;

  return (
    <div className="space-y-8 p-4 max-w-2xl mx-auto">

      <Link href="/panel/admin/plugins" className="flex gap-2 text-blue-600">
        <ArrowLeft size={20} /> Volver
      </Link>

      <h1 className="text-3xl font-bold">Editar Plugin</h1>

      <div className="bg-white dark:bg-gray-900 border shadow rounded-xl p-6 space-y-6">

        {/* NOMBRE */}
        <Field label="Nombre">
          <input className="input-premium" value={form.nombre} onChange={(e) => update("nombre", e.target.value)} />
        </Field>

        {/* DESCRIPCIÓN */}
        <Field label="Descripción">
          <textarea rows={4} className="input-premium" value={form.descripcion} onChange={(e) => update("descripcion", e.target.value)} />
        </Field>

        {/* IMAGEN */}
        <Field label="Imagen">
          <input type="file" onChange={subirImagen} />
          {form.imagen_url && <img src={form.imagen_url} className="w-32 mt-2 rounded" />}
        </Field>

        {/* ✅ ARCHIVO TSEP */}
        <Field label="Archivo plugin (.tsep)">
          <input type="file" onChange={subirTsep} />
          {form.archivo_url && (
            <a href={form.archivo_url} target="_blank" className="text-blue-600">
              Ver archivo actual
            </a>
          )}
        </Field>

        {/* ✅ VIDEO */}
        <Field label="Video YouTube">
          <input
            className="input-premium"
            value={form.video_url}
            onChange={(e) => update("video_url", e.target.value)}
          />
        </Field>

        {/* ✅ PREVIEW VIDEO */}
        {videoId && (
          <div className="aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              className="w-full h-full rounded"
              allowFullScreen
            />
          </div>
        )}

        {/* TIPOS */}
        <Field label="Trimestral">
          <input type="checkbox" checked={form.permite_trimestral} onChange={(e) => update("permite_trimestral", e.target.checked)} />
          <input type="number" value={form.precio_trimestral} onChange={(e) => update("precio_trimestral", e.target.value)} />
        </Field>

        <Field label="Anual">
          <input type="checkbox" checked={form.permite_anual} onChange={(e) => update("permite_anual", e.target.checked)} />
          <input type="number" value={form.precio_anual} onChange={(e) => update("precio_anual", e.target.value)} />
        </Field>

        <Field label="Completa">
          <input type="checkbox" checked={form.permite_completa} onChange={(e) => update("permite_completa", e.target.checked)} />
          <input type="number" value={form.precio_completa} onChange={(e) => update("precio_completa", e.target.value)} />
        </Field>

        <button onClick={guardar} className="w-full bg-blue-600 text-white py-3 rounded-lg">
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