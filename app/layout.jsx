"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function EditarUsuario() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [id, setId] = useState(null);

  // Obtener ID desde la URL
  useEffect(() => {
    const userId = new URLSearchParams(window.location.search).get("id");
    setId(userId);
  }, []);

  // Cargar datos del usuario
  async function cargar() {
    if (!id) return;

    try {
      const res = await fetch(`/api/admin/users/get?id=${id}`);
      const data = await res.json();

      if (!data.usuario) {
        toast.error("Usuario no encontrado");
        return;
      }

      setUsuario(data.usuario);
    } catch {
      toast.error("Error al cargar usuario");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargar();
  }, [id]);

  // Guardar cambios
  async function guardar(e) {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/admin/users/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuario)
      });

      const data = await res.json();

      if (data.ok) {
        toast.success("Usuario actualizado correctamente");
      } else {
        toast.error("Error al actualizar usuario");
      }
    } catch {
      toast.error("Error de conexión con el servidor");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !usuario) {
    return (
      <p className="text-gray-600 dark:text-gray-300">Cargando usuario...</p>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-xl mx-auto"
    >
      <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">
        Editar usuario
      </h1>

      <form
        onSubmit={guardar}
        className="space-y-5 bg-white dark:bg-neutral-950 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-neutral-800"
      >
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <input
            type="email"
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
            value={usuario.email}
            onChange={(e) => setUsuario({ ...usuario, email: e.target.value })}
          />
        </div>

        {/* Máx dispositivos */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Máx. dispositivos
          </label>
          <input
            type="number"
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
            value={usuario.max_dispositivos}
            onChange={(e) =>
              setUsuario({ ...usuario, max_dispositivos: e.target.value })
            }
            min="1"
          />
        </div>

        {/* Estado */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Estado
          </label>
          <select
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
            value={usuario.estado}
            onChange={(e) => setUsuario({ ...usuario, estado: e.target.value })}
          >
            <option value="activo">Activo</option>
            <option value="suspendido">Suspendido</option>
          </select>
        </div>

        {/* Nueva contraseña */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nueva contraseña (opcional)
          </label>
          <input
            type="password"
            placeholder="Nueva contraseña"
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
            onChange={(e) =>
              setUsuario({ ...usuario, nueva_password: e.target.value })
            }
          />
        </div>

        {/* Botón */}
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-blue-600 disabled:bg-blue-400 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>
    </motion.div>
  );
}
