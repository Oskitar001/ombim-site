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
    <div className="max-w-3xl mx-auto pt-32 px-6 bg-white dark:bg-[#111] min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Subir nuevo plugin
      </h1>

      <form
        onSubmit={subir}
        className="bg-white dark:bg-[#1a1a1a] shadow p-6 rounded space-y-4 border border-gray-200 dark:border-gray-700"
      >
        <input
          name="nombre"
          placeholder="Nombre del plugin"
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#111] text-gray-900 dark:text-gray-100 p-2 w-full rounded focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          required
        />

        <textarea
          name="descripcion"
          placeholder="Descripción"
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#111] text-gray-900 dark:text-gray-100 p-2 w-full rounded focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          required
        />

        <input
          type="file"
          name="archivo"
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#111] text-gray-900 dark:text-gray-100 p-2 w-full rounded focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          required
        />

        <input
          type="text"
          name="video_url"
          placeholder="URL del video (opcional)"
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#111] text-gray-900 dark:text-gray-100 p-2 w-full rounded focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
        />

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition active:scale-95"
        >
          Subir plugin
        </button>
      </form>
    </div>
  );
}
