"use client";
import { useEffect, useState } from "react";

export default function PluginsPage() {
  const [plugins, setPlugins] = useState([]);

  useEffect(() => {
    fetch("/api/plugin", { credentials: "include" })
      .then(res => res.json())
      .then(data => setPlugins(data));
  }, []);

  return (
    <div className="max-w-4xl mx-auto pt-32 px-6">
      <h1 className="text-3xl font-bold mb-8">APIs y Plugins</h1>

      {plugins.map(p => (
        <div key={p.id} className="mb-16">
          <h2 className="text-2xl font-semibold">{p.nombre}</h2>
          <p className="mb-4">{p.descripcion}</p>

          {p.video_url && (
            <iframe
              className="w-full h-64 mb-4 rounded-lg shadow"
              src={p.video_url.replace("watch?v=", "embed/")}
              title={p.nombre}
              allowFullScreen
            ></iframe>
          )}

          <a href={p.archivo_url} download>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Descargar
            </button>
          </a>
        </div>
      ))}
    </div>
  );
}
