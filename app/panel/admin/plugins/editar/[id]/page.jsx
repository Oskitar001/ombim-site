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

    // ✅ NUEVOS
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

      const p = d.plugin;

      setForm({
        nombre: p.nombre ?? "",
        descripcion: p.descripcion ?? "",
        precio: p.precio ?? 0,

        // ✅ NUEVOS CAMPOS
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

    const d = await r.json();

    if (!r.ok) {
      alert(d.error ?? "Error guardando cambios");
      return;
    }

    window.location.href = "/panel/admin/plugins";
  }

  if (loading) return <p className="p-4">Cargando plugin…</p>;

  return (
    <div className="space-y-8 p-4 max-w-2xl mx-auto">

      <Link href="/panel/admin/plugins" className="flex items-center gap-2 text-blue-600 hover:underline">
        <ArrowLeft size={20} /> Volver
      </Link>

      <h1 className="text-3xl font-bold">Editar Plugin</h1>

      <div className="bg-white dark:bg-gray-900 border shadow rounded-xl p-6 space-y-6">

        <Field label="Nombre">
          <input className="input-premium" value={form.nombre} onChange={(e) => update("nombre", e.target.value)} />
        </Field>

        <Field label="Descripción">
          <textarea rows={4} className="input-premium" value={form.descripcion} onChange={(e) => update("descripcion", e.target.value)} />
        </Field>

        {/* ✅ TIPOS DE LICENCIA */}
        <div className="space-y-4">
          <h3 className="font-semibold">Tipos de licencia</h3>

          {/* TRIMESTRAL */}
          <div className="flex justify-between items-center border p-3 rounded">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.permite_trimestral} onChange={(e) => update("permite_trimestral", e.target.checked)} />
              Trimestral
            </label>

            <input
              type="number"
              className="input-premium w-32"
              value={form.precio_trimestral}
              disabled={!form.permite_trimestral}
              onChange={(e) => update("precio_trimestral", e.target.value)}
            />
          </div>

          {/* ANUAL */}
          <div className="flex justify-between items-center border p-3 rounded">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.permite_anual} onChange={(e) => update("permite_anual", e.target.checked)} />
              Anual
            </label>

            <input
              type="number"
              className="input-premium w-32"
              value={form.precio_anual}
              disabled={!form.permite_anual}
              onChange={(e) => update("precio_anual", e.target.value)}
            />
          </div>

          {/* COMPLETA */}
          <div className="flex justify-between items-center border p-3 rounded">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.permite_completa} onChange={(e) => update("permite_completa", e.target.checked)} />
              Completa
            </label>

            <input
              type="number"
              className="input-premium w-32"
              value={form.precio_completa}
              disabled={!form.permite_completa}
              onChange={(e) => update("precio_completa", e.target.value)}
            />
          </div>
        </div>

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