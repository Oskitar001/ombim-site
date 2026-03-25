"use client";

import { useState } from "react";
import { PackagePlus, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NuevoPluginPage() {
  const [nombre, setNombre] = useState("");
  const [version, setVersion] = useState("");
  const [url, setUrl] = useState("");

  async function crear(e) {
    e.preventDefault();

    await fetch("/api/admin/plugins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, version, url_descarga: url }),
    });

    window.location.href = "/panel/admin/plugins";
  }

  return (
    <div className="space-y-6">

      <Link href="/panel/admin/plugins" className="text-blue-600 dark:text-blue-400 flex items-center gap-2">
        <ArrowLeft size={20} /> Volver
      </Link>

      <h1 className="text-3xl font-bold flex items-center gap-2">
        <PackagePlus size={28} /> Nuevo Plugin
      </h1>

      <form onSubmit={crear} className="space-y-4 max-w-lg">

        <div>
          <label className="font-semibold">Nombre</label>
          <input
            className="w-full border p-2 rounded dark:bg-gray-800 dark:text-white"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="font-semibold">Versión</label>
          <input
            className="w-full border p-2 rounded dark:bg-gray-800 dark:text-white"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="font-semibold">URL Descarga</label>
          <input
            className="w-full border p-2 rounded dark:bg-gray-800 dark:text-white"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        </div>

        <button className="btn-primary">Crear plugin</button>

      </form>
    </div>
  );
}