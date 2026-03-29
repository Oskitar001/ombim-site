"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function EditarPluginPage() {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  function update(campo, valor) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }

  useEffect(() => {
    if (!id) return;

    async function load() {
      try {
        const res = await fetch(`/api/plugin/${id}`, {
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok || data.error) {
          console.error("Error cargando plugin:", data);
          setForm(null);
          return;
        }

        setForm({
          nombre: data.nombre ?? "",
          descripcion: data.descripcion ?? "",
          precio: Number(data.precio) ?? 0,
          precio_anual: Number(data.precio_anual) ?? 0,
          precio_completa: Number(data.precio_completa) ?? 0,
          archivo_url: data.archivo_url ?? "",
          video_url: data.video_url ?? "",
          imagen_url: data.imagen_url ?? "",
        });
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  async function guardar() {
    if (!form) return;

    const res = await fetch("/api/admin/plugins/editar", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...form }),
    });

    if (res.ok) {
      window.location.href = "/panel/admin/plugins";
    }
  }

  async function subir(file, tipo) {
    if (!file) return;

    const endpoint = `/api/admin/${tipo === "imagen" ? "upload-image" : "upload-tsep"}?name=${file.name}`;

    const res = await fetch(endpoint, {
      method: "POST",
      credentials: "include",
      body: file,
    });

    const json = await res.json();
    if (!json.url) return;

    const campo = tipo === "imagen" ? "imagen_url" : "archivo_url";
    update(campo, json.url);
  }

  if (loading) return <p className="p-6">Cargando plugin…</p>;
  if (!form) return <p>No se pudo cargar el plugin</p>;

  return (
    <div className="space-y-6 p-4 max-w-xl mx-auto">
      <Link href="/panel/admin/plugins" className="flex items-center gap-2 text-blue-600">
        <ArrowLeft size={18} />
        Volver
      </Link>

      <h1 className="text-3xl font-bold mb-4">Editar plugin</h1>

      <label className="block font-semibold">Nombre</label>
      <input
        value={form.nombre}
        onChange={(e) => update("nombre", e.target.value)}
        className="w-full p-2 rounded border dark:bg-gray-900"
      />

      <label className="block font-semibold mt-2">Descripción</label>
      <textarea
        value={form.descripcion}
        rows={3}
        onChange={(e) => update("descripcion", e.target.value)}
        className="w-full p-2 rounded border dark:bg-gray-900"
      />

      <label className="block font-semibold mt-2">Precio estándar (€)</label>
      <input
        type="number"
        value={form.precio}
        onChange={(e) => update("precio", Number(e.target.value))}
        className="w-full p-2 rounded border dark:bg-gray-900"
      />

      <label className="block font-semibold mt-2">Precio anual (€)</label>
      <input
        type="number"
        value={form.precio_anual}
        onChange={(e) => update("precio_anual", Number(e.target.value))}
        className="w-full p-2 rounded border dark:bg-gray-900"
      />

      <label className="block font-semibold mt-2">Precio completa (€)</label>
      <input
        type="number"
        value={form.precio_completa}
        onChange={(e) => update("precio_completa", Number(e.target.value))}
        className="w-full p-2 rounded border dark:bg-gray-900"
      />

      <div className="mt-3">
        <label>Archivo .tsep</label>
        <input
          type="file"
          accept=".tsep"
          onChange={(e) => subir(e.target.files[0], "tsep")}
        />
        {form.archivo_url && (
          <p className="text-sm text-green-600">
            {form.archivo_url.split("/").pop()}
          </p>
        )}
      </div>

      <div className="mt-3">
        <label>Video (YouTube)</label>
        <input
          value={form.video_url}
          onChange={(e) => update("video_url", e.target.value)}
          className="w-full p-2 rounded border dark:bg-gray-900"
        />
      </div>

      <div className="mt-3">
        <label>Imagen del plugin</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => subir(e.target.files[0], "imagen")}
        />
        {form.imagen_url && (
          <p className="text-sm text-green-600">
            {form.imagen_url.split("/").pop()}
          </p>
        )}
      </div>

      <button
        onClick={guardar}
        className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 mt-4"
      >
        Guardar cambios
      </button>
    </div>
  );
}
