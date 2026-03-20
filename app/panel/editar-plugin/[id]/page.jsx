"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditarPlugin({ params }) {
  const router = useRouter();
  const { id } = params;

  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [plugin, setPlugin] = useState(null);
  const [ready, setReady] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    // Verificar usuario admin
    fetch("/api/auth/me", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        if (!data.user || data.role !== "admin") {
          router.push("/login");
        } else {
          setUser(data.user);
          setRole(data.role);
        }
      });

    // Cargar plugin
    fetch(`/api/plugin/get?id=${id}`)
      .then(res => res.json())
      .then(data => {
        if (!data || data.error) {
          router.push("/panel/plugins");
          return;
        }
        setPlugin(data);
        setReady(true);
      });
  }, [id, router]);

  const actualizar = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setMensaje("");

    const form = new FormData(e.target);
    form.append("id", id);

    const res = await fetch("/api/plugin/update", {
      method: "POST",
      body: form
    });

    if (res.ok) {
      setMensaje("Cambios guardados correctamente.");
      setTimeout(() => router.push("/panel/plugins"), 1200);
    } else {
      setMensaje("Error al guardar los cambios.");
    }

    setGuardando(false);
  };

  if (!ready || !plugin || !user || role !== "admin") return null;

  return (
    <div className="max-w-3xl mx-auto pt-32 px-6 bg-[#f3f4f6]Soft dark:bg-[#242424] min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-[#1f2937] dark:text-[#e6e6e6]">
        Editar Plugin
      </h1>

      <form
        onSubmit={actualizar}
        className="bg-[#f3f4f6]Soft dark:bg-[#1a1a1a] shadow p-6 rounded space-y-4 border border-[#d1d5db] dark:border-[#3a3a3a]"
      >
        <input
          name="nombre"
          defaultValue={plugin.nombre}
          placeholder="Nombre del plugin"
          className="border border-[#d1d5db] dark:border-gray-600 bg-[#f3f4f6]Soft dark:bg-[#242424] text-[#1f2937] dark:text-[#e6e6e6] p-2 w-full rounded"
          required
        />

        <textarea
          name="descripcion"
          defaultValue={plugin.descripcion}
          placeholder="Descripción"
          className="border border-[#d1d5db] dark:border-gray-600 bg-[#f3f4f6]Soft dark:bg-[#242424] text-[#1f2937] dark:text-[#e6e6e6] p-2 w-full rounded"
          required
        />

        <input
          type="number"
          name="precio"
          defaultValue={plugin.precio}
          placeholder="Precio (€)"
          step="0.01"
          min="0"
          className="border border-[#d1d5db] dark:border-gray-600 bg-[#f3f4f6]Soft dark:bg-[#242424] text-[#1f2937] dark:text-[#e6e6e6] p-2 w-full rounded"
          required
        />

        <input
          type="text"
          name="video_url"
          defaultValue={plugin.video_url || ""}
          placeholder="URL del video (opcional)"
          className="border border-[#d1d5db] dark:border-gray-600 bg-[#f3f4f6]Soft dark:bg-[#242424] text-[#1f2937] dark:text-[#e6e6e6] p-2 w-full rounded"
        />

        <p className="text-[#1f2937] dark:text-[#e6e6e6] text-sm">
          Archivo actual:
          <a
            href={plugin.archivo_url}
            className="text-blue-600 dark:text-blue-400 underline ml-1"
            target="_blank"
          >
            Descargar ZIP
          </a>
        </p>

        <input
          type="file"
          name="archivo"
          accept=".zip"
          className="border border-[#d1d5db] dark:border-gray-600 bg-[#f3f4f6]Soft dark:bg-[#242424] text-[#1f2937] dark:text-[#e6e6e6] p-2 w-full rounded"
        />

        <button
          disabled={guardando}
          className={`px-4 py-2 rounded text-white transition ${
            guardando ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {guardando ? "Guardando..." : "Guardar cambios"}
        </button>

        {mensaje && (
          <p className="mt-2 text-green-600 dark:text-green-400 font-semibold">
            {mensaje}
          </p>
        )}
      </form>
    </div>
  );
}
