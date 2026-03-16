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
    <div className="max-w-3xl mx-auto pt-32 px-6">
      <h1 className="text-3xl font-bold mb-6">Editar Plugin</h1>

      <form onSubmit={actualizar} className="bg-white shadow p-6 rounded space-y-4">
        <input
          name="nombre"
          defaultValue={plugin.nombre}
          placeholder="Nombre del plugin"
          className="border p-2 w-full"
          required
        />

        <textarea
          name="descripcion"
          defaultValue={plugin.descripcion}
          placeholder="Descripción"
          className="border p-2 w-full"
          required
        />

        <input
          type="text"
          name="video_url"
          defaultValue={plugin.video_url || ""}
          placeholder="URL del video (opcional)"
          className="border p-2 w-full"
        />

        <p className="text-gray-600 text-sm">
          Archivo actual:  
          <a href={plugin.archivo_url} className="text-blue-600 underline ml-1" target="_blank">
            Descargar
          </a>
        </p>

        <input
          type="file"
          name="archivo"
          className="border p-2 w-full"
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Guardar cambios
        </button>
      </form>
    </div>
  );
}
