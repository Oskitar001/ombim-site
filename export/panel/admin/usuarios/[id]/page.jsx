"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  KeyRound,
  CreditCard,
  Clock,
  Mail,
} from "lucide-react";

export default function AdminUsuarioDetallePage() {
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [licencias, setLicencias] = useState([]);
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);

  // ===============================================================
  // CARGAR DATOS DEL USUARIO
  // ===============================================================
  useEffect(() => {
    async function load() {
      try {
        const r = await fetch(`/api/admin/usuarios/${id}`, {
          credentials: "include",
        });

        const d = await r.json();

        if (!r.ok) {
          alert(d.error ?? "Error cargando usuario");
          return;
        }

        setUser(d.user ?? null);
        setLicencias(d.licencias ?? []);
        setPagos(d.pagos ?? []);

      } catch (e) {
        alert("Error conectando al servidor.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  // ===============================================================
  if (loading) return <p className="p-4">Cargando usuario…</p>;
  if (!user) return <p className="p-4">Usuario no encontrado</p>;
  // ===============================================================

  return (
    <div className="p-4 max-w-5xl mx-auto space-y-12">

      {/* VOLVER */}
      <Link
        href="/panel/admin/usuarios"
        className="text-blue-600 hover:underline flex items-center gap-2"
      >
        <ArrowLeft size={20} /> Volver
      </Link>

      {/* ================= TÍTULO ================= */}
      <h1 className="text-3xl font-bold flex items-center gap-3">
        <User size={32} /> Usuario #{user.id}
      </h1>

      {/* ================= INFORMACIÓN DEL USUARIO ================= */}
      <section className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 p-6 rounded-xl shadow space-y-4">

        <h2 className="text-xl font-semibold mb-3">Información del usuario</h2>

        <div className="space-y-2 text-sm">
          <p className="flex items-center gap-2">
            <Mail size={18} className="opacity-70" />
            <strong>Email:</strong> {user.email}
          </p>

          <p className="flex items-center gap-2">
            <Clock size={18} className="opacity-70" />
            <strong>Registrado:</strong>{" "}
            {user.created_at
              ? new Date(user.created_at).toLocaleString()
              : "—"}
          </p>
        </div>
      </section>

      {/* ================= LICENCIAS ================= */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <KeyRound size={24} /> Licencias
        </h2>

        {/* MÓVIL → CARDS */}
        <div className="grid md:hidden gap-4">
          {licencias.length === 0 && (
            <p className="opacity-70">No tiene licencias registradas.</p>
          )}

          {licencias.map((l) => (
            <div
              key={l.id}
              className="p-4 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl shadow space-y-2"
            >
              <p className="font-semibold text-lg">Licencia #{l.id}</p>

              <p className="text-sm opacity-80">
                Plugin: {l.plugins?.nombre ?? l.plugin_id}
              </p>

              <p className="text-sm">Email Tekla: {l.email_tekla}</p>

              <p className="text-sm">
                Estado: <strong>{l.estado}</strong>
              </p>

              <p className="text-sm">
                Activaciones:{" "}
                {l.activaciones_usadas}/{l.max_activaciones}
              </p>

              <p className="text-sm opacity-70">
                Creada: {new Date(l.fecha_creacion).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        {/* DESKTOP → TABLA */}
        <div className="hidden md:block rounded-xl border border-gray-300 dark:border-gray-700 shadow overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wider">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Plugin</th>
                <th className="p-3">Email Tekla</th>
                <th className="p-3">Estado</th>
                <th className="p-3">Activaciones</th>
                <th className="p-3">Creada</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {licencias.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="p-4 text-center opacity-70"
                  >
                    No tiene licencias registradas
                  </td>
                </tr>
              )}

              {licencias.map((l) => (
                <tr
                  key={l.id}
                  className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
                >
                  <td className="p-3">#{l.id}</td>
                  <td className="p-3">{l.plugins?.nombre ?? l.plugin_id}</td>
                  <td className="p-3">{l.email_tekla}</td>
                  <td className="p-3">{l.estado}</td>
                  <td className="p-3">
                    {l.activaciones_usadas}/{l.max_activaciones}
                  </td>
                  <td className="p-3">
                    {new Date(l.fecha_creacion).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </section>

      {/* ================= PAGOS ================= */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <CreditCard size={24} /> Pagos
        </h2>

        {/* MÓVIL */}
        <div className="grid md:hidden gap-4">
          {pagos.length === 0 && (
            <p className="opacity-70">No tiene pagos registrados.</p>
          )}

          {pagos.map((p) => (
            <div
              key={p.id}
              className="p-4 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl shadow space-y-2"
            >
              <p className="font-semibold text-lg">Pago #{p.id}</p>
              <p className="text-sm">Plugin: {p.plugin_nombre ?? p.plugin_id}</p>
              <p className="text-sm">Cantidad: {p.cantidad_licencias}</p>
              <p className="text-sm font-bold">Total: {p.importe} €</p>
              <p className="text-sm opacity-70">
                Fecha: {new Date(p.fecha).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        {/* DESKTOP */}
        <div className="hidden md:block rounded-xl border border-gray-300 dark:border-gray-700 shadow overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wider">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Plugin</th>
                <th className="p-3">Cantidad</th>
                <th className="p-3">Total</th>
                <th className="p-3">Fecha</th>
              </tr>
            </thead>

            <tbody className="text-sm">
              {pagos.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center opacity-70 p-4">
                    No tiene pagos registrados.
                  </td>
                </tr>
              )}

              {pagos.map((p) => (
                <tr
                  key={p.id}
                  className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
                >
                  <td className="p-3">#{p.id}</td>
                  <td className="p-3">{p.plugin_nombre ?? p.plugin_id}</td>
                  <td className="p-3">{p.cantidad_licencias}</td>
                  <td className="p-3 font-bold">{p.importe} €</td>
                  <td className="p-3">
                    {new Date(p.fecha).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </section>

    </div>
  );
}