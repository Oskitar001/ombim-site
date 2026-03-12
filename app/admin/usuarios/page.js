"use client";

import { useEffect, useState } from "react";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState("todos");

  async function cargar() {
    const res = await fetch("/api/admin/usuarios");
    const data = await res.json();
    setUsuarios(data);
  }

  useEffect(() => {
    cargar();
  }, []);

  // FILTRO POR ESTADO
  const filtrados = usuarios
    .filter((u) =>
      u.email.toLowerCase().includes(busqueda.toLowerCase())
    )
    .filter((u) => {
      if (filtro === "todos") return true;
      if (filtro === "activo") return u.estado === "activo";
      if (filtro === "suspendido") return u.estado === "suspendido";
      if (filtro === "expirado") {
        const hoy = new Date();
        const exp = new Date(u.fecha_expiracion);
        return exp < hoy;
      }
      return true;
    });

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Usuarios</h1>

      {/* Controles superiores */}
      <div className="mb-6 flex flex-wrap gap-4 justify-between items-center">

        {/* Botón crear */}
        <a
          href="/admin/usuarios/crear"
          className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700"
        >
          Crear nuevo usuario +
        </a>

        {/* Buscador */}
        <input
          type="text"
          placeholder="Buscar por email..."
          className="border p-2 rounded w-64"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {/* Filtros */}
      <div className="mb-6 flex gap-3">
        <button
          onClick={() => setFiltro("todos")}
          className={`px-4 py-2 rounded ${
            filtro === "todos" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Todos
        </button>

        <button
          onClick={() => setFiltro("activo")}
          className={`px-4 py-2 rounded ${
            filtro === "activo" ? "bg-green-600 text-white" : "bg-gray-200"
          }`}
        >
          Activos
        </button>

        <button
          onClick={() => setFiltro("suspendido")}
          className={`px-4 py-2 rounded ${
            filtro === "suspendido" ? "bg-red-600 text-white" : "bg-gray-200"
          }`}
        >
          Suspendidos
        </button>

        <button
          onClick={() => setFiltro("expirado")}
          className={`px-4 py-2 rounded ${
            filtro === "expirado" ? "bg-yellow-600 text-white" : "bg-gray-200"
          }`}
        >
          Expirados
        </button>
      </div>

      {/* Tabla */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Estado</th>
            <th className="p-2 border">Expira</th>
            <th className="p-2 border">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {filtrados.map((u) => (
            <tr key={u.id} className="border hover:bg-gray-50">
              <td className="p-2 border">{u.email}</td>
              <td className="p-2 border capitalize">{u.estado}</td>
              <td className="p-2 border">{u.fecha_expiracion}</td>
              <td className="p-2 border">
                <a
                  href={`/admin/usuario/${u.id}`}
                  className="text-blue-600 underline"
                >
                  Ver usuario →
                </a>
              </td>
            </tr>
          ))}

          {filtrados.length === 0 && (
            <tr>
              <td colSpan="4" className="p-4 text-center text-gray-500">
                No se encontraron usuarios.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
