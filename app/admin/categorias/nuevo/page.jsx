"use client";

import { useState } from "react";

export default function NuevaCategoria() {
  const [nombre, setNombre] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("/api/admin/categorias", {
      method: "POST",
      body: JSON.stringify({ nombre }),
    });

    window.location.href = "/admin/categorias";
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Nueva Categoría</h1>

      <form onSubmit={handleSubmit} className="grid gap-4 max-w-md">
        <input
          className="border p-2"
          placeholder="Nombre de la categoría"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <button className="bg-green-600 text-white px-4 py-2 rounded">
          Guardar
        </button>
      </form>
    </div>
  );
}
