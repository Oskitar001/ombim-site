"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  async function cargar() {
    try {
      const res = await fetch(`/api/admin/users/list?q=${busqueda}`);
      const data = await res.json();
      setUsuarios(data.usuarios || []);
    } catch {
      toast.error("Error al cargar usuarios");
    }
  }

  useEffect(() => {
    cargar();
  }, [busqueda]);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-900 dark:text:white dark:text-white">
          Usuarios
        </h1>
        <a
          href="/admin/usuarios/crear"
          className="bg-blue-600 text-white px-5 py-3 rounded-lg shadow hover:bg-blue-700 transition"
        >
          + Crear usuario
        </a>
      </div>

      <input
        type="text"
        placeholder="Buscar usuario..."
        className="w-full p-3 mb-6 rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <div className="bg-white dark:bg-neutral-950 shadow-lg rounded-xl border border-gray-200 dark:border-neutral-800 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 dark:bg-neutral-900">
            <tr>
              <th className="p-4 text-left text-gray-700 dark:text-gray-300">ID</th>
              <th className="p-4 text-left text-gray-700 dark:text-gray-300">Email</th>
              <th className="p-4 text-left text-gray-700 dark:text-gray-300">Estado</th>
              <th className="p-4 text-left text-gray-700 dark:text-gray-300">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {usuarios.map((u, i) => (
              <motion.tr
                key={u.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="border-t border-gray-200 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-900"
              >
                <td className="p-4 text-gray-900 dark:text-gray-100">{u.id}</td>
                <td className="p-4 text-gray-900 dark:text-gray-100">{u.email}</td>
                <td className="p-4 capitalize text-gray-900 dark:text-gray-100">
                  {u.estado}
                </td>
                <td className="p-4">
                  <a
                    href={`/admin/usuarios/editar?id=${u.id}`}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Editar
                  </a>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
