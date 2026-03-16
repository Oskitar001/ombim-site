"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SubirPlugin() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        if (!data.user || data.user.role !== "admin") router.push("/login");
        else setUser(data.user);
      });
  }, []);

  const subir = async (e) => {
    e.preventDefault();

    const form = new FormData(e.target);

    await fetch("/api/plugin/upload", {
      method: "POST",
      body: form
    });

    router.push("/panel/plugins");
  };

  return (
    <div className="max-w-3xl mx-auto pt-32 px-6">
      <h1 className="text-3xl font-bold mb-6">Subir nuevo plugin</h1>

      <form onSubmit={subir} className="bg-white shadow p-6 rounded space-y-4">
        <input name="nombre" placeholder="Nombre del plugin" className="border p-2 w-full" required />
        <textarea name="descripcion" placeholder="Descripción" className="border p-2 w-full" required />
        <input type="file" name="archivo" className="border p-2 w-full" required />
        <input type="text" name="video_url" placeholder="URL del video (opcional)" className="border p-2 w-full" />

        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Subir plugin
        </button>
      </form>
    </div>
  );
}
