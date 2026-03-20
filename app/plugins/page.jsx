"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

// Convierte cualquier enlace de YouTube a formato embed
function toEmbed(url) {
  if (!url) return null;

  if (url.includes("youtu.be")) {
    return "https://www.youtube.com/embed/" + url.split("youtu.be/")[1];
  }

  if (url.includes("watch?v=")) {
    return "https://www.youtube.com/embed/" + url.split("watch?v=")[1].split("&")[0];
  }

  return url;
}

// Extrae el ID del vídeo para miniatura
function getVideoId(url) {
  if (!url) return null;

  if (url.includes("youtu.be/")) {
    return url.split("youtu.be/")[1];
  }

  if (url.includes("watch?v=")) {
    return url.split("watch?v=")[1].split("&")[0];
  }

  return null;
}

export default function PluginsPage() {
  const [plugins, setPlugins] = useState([]);

  useEffect(() => {
    fetch("/api/plugin", { credentials: "include" })
      .then(res => res.json())
      .then(data => setPlugins(data));
  }, []);

  return (
    <div className="max-w-4xl mx-auto pt-32 px-6 bg-[#f3f4f6]Soft dark:bg-[#242424] min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-[#1f2937] dark:text-[#e6e6e6]">
        APIs y Plugins
      </h1>

      {plugins.map(p => {
        const videoId = getVideoId(p.video_url);
        const esDePago = p.precio && p.precio > 0;

        return (
          <div
            key={p.id}
            className="mb-16 bg-[#f3f4f6]Soft dark:bg-[#1a1a1a] p-6 rounded-xl shadow border border-[#d1d5db] dark:border-[#3a3a3a]"
          >
            {/* Título con enlace */}
            <Link
              href={`/plugins/${p.id}`}
              className="text-2xl font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              {p.nombre}
            </Link>

            {/* Precio */}
            <p className="mt-1 mb-2 text-sm text-gray-500 dark:text-gray-400">
              {esDePago ? `${p.precio} €` : "Gratis"}
            </p>

            <p className="mb-4 text-[#1f2937] dark:text-[#e6e6e6]">
              {p.descripcion}
            </p>

            {/* Miniatura clicable */}
            {videoId && (
              <Link href={`/plugins/${p.id}`}>
                <img
                  src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                  alt={p.nombre}
                  className="w-full rounded-lg mb-4 shadow cursor-pointer hover:opacity-90 transition"
                />
              </Link>
            )}

            {/* Iframe opcional */}
            {p.video_url && (
              <iframe
                className="w-full h-64 mb-4 rounded-lg shadow bg-black dark:bg-[#000]"
                src={toEmbed(p.video_url)}
                title={p.nombre}
                allowFullScreen
              ></iframe>
            )}

            {/* Botón según precio */}
            {esDePago ? (
              <Link href={`/plugins/${p.id}`}>
                <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition active:scale-95">
                  Ver plugin / Comprar
                </button>
              </Link>
            ) : (
              <a href={p.archivo_url} download>
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition active:scale-95">
                  Descargar
                </button>
              </a>
            )}
          </div>
        );
      })}
    </div>
  );
}
