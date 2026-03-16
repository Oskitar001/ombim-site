"use client";
import { useEffect, useState } from "react";

// Convierte cualquier enlace de YouTube a formato embed
function toEmbed(url) {
  if (!url) return null;

  // Caso: https://youtu.be/ID
  if (url.includes("youtu.be")) {
    return "https://www.youtube.com/embed/" + url.split("youtu.be/")[1];
  }

  // Caso: https://www.youtube.com/watch?v=ID
  if (url.includes("watch?v=")) {
    return "https://www.youtube.com/embed/" + url.split("watch?v=")[1].split("&")[0];
  }

  return url; // fallback
}

export default function PluginsPage() {
  const [plugins, setPlugins] = useState([]);

  useEffect(() => {
    fetch("/api/plugin", { credentials: "include" })
      .then(res => res.json())
      .then(data => setPlugins(data));
  }, []);

  return (
    <div className="max-w-4xl mx-auto pt-32 px-6 bg-white dark:bg-[#111] min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">
        APIs y Plugins
      </h1>

      {plugins.map(p => (
        <div
          key={p.id}
          className="mb-16 bg-white dark:bg-[#1a1a1a] p-6 rounded-xl shadow border border-gray-200 dark:border-gray-700"
        >
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            {p.nombre}
          </h2>

          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {p.descripcion}
          </p>

          {p.video_url && (
            <iframe
              className="w-full h-64 mb-4 rounded-lg shadow bg-black dark:bg-[#000]"
              src={toEmbed(p.video_url)}
              title={p.nombre}
              allowFullScreen
            ></iframe>
          )}

          <a href={p.archivo_url} download>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition active:scale-95">
              Descargar
            </button>
          </a>
        </div>
      ))}
    </div>
  );
}
