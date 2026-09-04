"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";

export default function Page() {
  const { plugin_id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [plugin, setPlugin] = useState(null);
  const [user, setUser] = useState(null);

  const [cantidad, setCantidad] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ nunca vacío
  const [tipo, setTipo] = useState("");

  useEffect(() => {
    if (!plugin_id) return;

    async function load() {
      try {
        const rUser = await fetch("/api/auth/me");
        const dUser = await rUser.json();
        setUser(dUser.user ?? null);

        const rPlugin = await fetch(`/api/plugin/${plugin_id}`);
        const dPlugin = await rPlugin.json();

        setPlugin(dPlugin?.error ? null : dPlugin);

        const plan = searchParams.get("plan");

        if (dPlugin && !dPlugin.error) {
          let tipoValido = null;

          if (plan === "trimestral" && dPlugin.permite_trimestral) {
            tipoValido = "trimestral";
          }

          if (plan === "anual" && dPlugin.permite_anual) {
            tipoValido = "anual";
          }

          if (plan === "completa" && dPlugin.permite_completa) {
            tipoValido = "completa";
          }

          // ✅ fallback SIEMPRE a algo válido
          if (!tipoValido) {
            if (dPlugin.permite_trimestral) tipoValido = "trimestral";
            else if (dPlugin.permite_anual) tipoValido = "anual";
            else if (dPlugin.permite_completa) tipoValido = "completa";
            else tipoValido = "completa"; // 🔥 seguridad total
          }

          setTipo(tipoValido);
        }

      } catch {
        setError("Error cargando datos");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [plugin_id, searchParams]);

  async function crearPago() {
    if (!user) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch("/api/pagos/crear", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plugin_id,
          cantidad,
          tipo,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error ?? "Error creando el pago");
        return;
      }

      router.push(`/pago/licencias/${data.pago_id}`);
    } catch (err) {
      console.error(err);
      setError("Error interno del servidor");
    }
  }

  if (loading) return <p>Cargando...</p>;
  if (!plugin) return <p>Plugin no encontrado.</p>;

  let precioUnitario = 0;

  if (tipo === "trimestral") {
    precioUnitario = Number(plugin.precio_trimestral) || 0;
  }

  if (tipo === "anual") {
    precioUnitario = Number(plugin.precio_anual) || 0;
  }

  if (tipo === "completa") {
    precioUnitario = Number(plugin.precio_completa) || 0;
  }

  const subtotal = precioUnitario * cantidad;
  const iva = subtotal * 0.21;
  const total = subtotal + iva;

  const vieneConPlan = !!searchParams.get("plan");

  return (
    <div className="p-4 max-w-xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Comprar licencias</h1>

      <p className="text-lg">
        Plugin: <strong>{plugin.nombre}</strong>
      </p>

      {/* ✅ ocultar selector si viene con plan */}
      {!vieneConPlan && (
        <div>
          <label className="font-semibold">Tipo de licencia:</label>

          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="border p-2 rounded w-full dark:bg-gray-900"
          >
            {plugin.permite_trimestral && (
              <option value="trimestral">
                Trimestral – {(Number(plugin.precio_trimestral) || 0).toFixed(2)} €
              </option>
            )}

            {plugin.permite_anual && (
              <option value="anual">
                Anual – {(Number(plugin.precio_anual) || 0).toFixed(2)} €
              </option>
            )}

            {plugin.permite_completa && (
              <option value="completa">
                Completa – {(Number(plugin.precio_completa) || 0).toFixed(2)} €
              </option>
            )}
          </select>
        </div>
      )}

      <div>
        <h3 className="font-semibold mb-2">Cantidad de licencias:</h3>

        <input
          type="number"
          min="1"
          value={cantidad}
          onChange={(e) => setCantidad(Number(e.target.value))}
          className="w-full p-2 border rounded mb-2 dark:bg-gray-900"
        />
      </div>

      <div className="space-y-1 text-lg">
        <p>
          <strong>Subtotal:</strong> {subtotal.toFixed(2)} €
        </p>
        <p>
          <strong>IVA (21%):</strong> {iva.toFixed(2)} €
        </p>
        <p className="text-2xl font-bold">
          <strong>Total:</strong> {total.toFixed(2)} €
        </p>
      </div>

      {error && <p className="text-red-600">{error}</p>}

      <button
        onClick={crearPago}
        className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
      >
        Comprar
      </button>
    </div>
  );
}