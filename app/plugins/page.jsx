"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

function getVideoId(url) {
  if (!url) return null;
  if (url.includes("youtu.be/")) return url.split("youtu.be/")[1];
  if (url.includes("watch?v=")) return url.split("watch?v=")[1].split("&")[0];
  return null;
}

export default function PluginsPage() {
  const [plugins, setPlugins] = useState([]);

  useEffect(() => {
    fetch("/api/plugin", { credentials: "include" })
      .then(res => res.json())
      .then(data => setPlugins(data || []));
  }, []);

  return (
    <div className="max-w-4xl mx-auto pt-32 px-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">APIs y Plugins</h1>

      {plugins.map(p => {
        const videoId = getVideoId(p.video_url);

        return (
          <div
            key={p.id}
            className="mb-16 p-6 rounded-xl shadow border"
          >
            <Link
              href={`/plugins/${p.id}`}
              className="text-2xl font-semibold text-blue-600 hover:underline"
            >
              {p.nombre}
            </Link>

            <p className="mt-1 mb-2 text-sm text-gray-500">
              {p.precio > 0 ? `${p.precio} €` : "Gratis"}
            </p>

            <p className="mb-4">{p.descripcion}</p>

            {videoId && (
              <Link href={`/plugins/${p.id}`}>
                <img
                  src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                  alt={p.nombre}
                  className="w-full rounded-lg mb-4 shadow cursor-pointer hover:opacity-90 transition"
                />
              </Link>
            )}

            <Link href={`/plugins/${p.id}`}>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition active:scale-95">
                Ver plugin
              </button>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
