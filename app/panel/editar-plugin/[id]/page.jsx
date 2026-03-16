"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditarPlugin({ params }) {
  const router = useRouter();
  const { id } = params;

  const [user, setUser] = useState(null);
  const [plugin, setPlugin] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Verificar usuario
    fetch("/api/auth/me", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        if (!data.user || data.user.role !== "admin") {
          router.push("/login");
        } else {
          setUser(data.user);
        }
      });

    // Cargar plugin
    fetch(`/api/plugin/get?id=${id}`)
      .then(res => res.json())
      .then(data => {
        setPlugin(data);
        setReady(true);
      });
  }, [id]);

  const actualizar = async (e) => {
    e.preventDefault();

    const form = new FormData(e.target);
    form.append("id", id);

    await fetch("/api/plugin/update", {
      method: "POST",
      body: form
    });

    router.push("/panel/plugins");
  };

  if (!ready || !plugin) return null;

  return (
    <div className="max-w-3xl mx-auto pt-32 px-6 bg-white dark:bg-[#111] min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Editar Plugin
      </h1>

      <form
        onSubmit={actualizar}
        className="bg-white dark:bg-[#1a1a1a] shadow p-6 rounded space-y-4 border border-gray-200 dark:border-gray-700"
      >
        <input
          name="nombre"
          defaultValue={plugin.nombre}
          placeholder="Nombre del plugin"
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#111] text-gray-900 dark:text-gray-100 p-2 w-full rounded focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          required
        />

        <textarea
          name="descripcion"
          defaultValue={plugin.descripcion}
          placeholder="Descripción"
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#111] text-gray-900 dark:text-gray-100 p-2 w-full rounded focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          required
        />

        <input
          type="text"
          name="video_url"
          defaultValue={plugin.video_url || ""}
          placeholder="URL del video (opcional)"
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#111] text-gray-900 dark:text-gray-100 p-2 w-full rounded focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
        />

        <p className="text-gray-600 dark:text-gray-300 text-sm">
          Archivo actual:
          <a
            href={plugin.archivo_url}
            className="text-blue-600 dark:text-blue-400 underline ml-1"
            target="_blank"
          >
            Descargar
          </a>
        </p>

        <input
          type="file"
          name="archivo"
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#111] text-gray-900 dark:text-gray-100 p-2 w-full rounded focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition active:scale-95">
          Guardar cambios
        </button>
      </form>
    </div>
  );
}
