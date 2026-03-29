"use client";

import { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";

export default function ComprarPage({ params }) {
  const router = useRouter();
  const { plugin_id } = params;

  const [plugin, setPlugin] = useState(null);
  const [user, setUser] = useState(null);
  const [emails, setEmails] = useState([""]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ⭐ nuevo: tipo de licencia (anual / completa)
  const [tipo, setTipo] = useState("completa");

  const paymentUID = useRef(uuidv4());

  useEffect(() => {
    async function load() {
      try {
        const rUser = await fetch("/api/auth/me");
        const dUser = await rUser.json();
        setUser(dUser.user ?? null);

        const rPlugin = await fetch(`/api/plugin/${plugin_id}`);
        const dPlugin = await rPlugin.json();
        setPlugin(dPlugin?.error ? null : dPlugin);
      } catch {
        setError("Error cargando datos");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [plugin_id]);

  function actualizarEmail(i, valor) {
    setEmails((prev) => prev.map((e, idx) => (idx === i ? valor : e)));
  }

  function añadirFila() {
    setEmails((prev) => [...prev, ""]);
  }

  async function comprar(e) {
    e.preventDefault();
    setError("");

    if (!user) {
      router.push("/login");
      return;
    }

    const emailsLimpios = emails.map((e) => e.trim());

    if (emailsLimpios.some((e) => e === "")) {
      setError("Debes completar TODOS los emails Tekla.");
      return;
    }

    try {
      const res = await fetch("/api/pagos/crear", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plugin_id,
          emails_tekla: emailsLimpios,
          payment_uid: paymentUID.current,
          tipo, // ⭐ añadido correctamente
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error ?? "Error creando el pago");
        return;
      }

      router.push(`/pago/licencias/${data.pago_id}`);
    } catch {
      setError("Error interno del servidor");
    }
  }

  if (loading) return <p>Cargando…</p>;
  if (!plugin) return <p>Plugin no encontrado.</p>;

  // ============================================
  // ⭐ CÁLCULO DE PRECIOS (ANUAL / COMPLETA)
  // ============================================

  const precioCompleta =
    plugin.precio_completa > 0 ? plugin.precio_completa : plugin.precio;

  const precioAnual = plugin.precio_anual > 0 ? plugin.precio_anual : 0;

  const precioUnitario =
    tipo === "anual" ? precioAnual : precioCompleta;

  const total = precioUnitario * emails.length;

  return (
    <div className="p-4 max-w-xl mx-auto space-y-6">

      <h2 className="text-3xl font-bold">Comprar licencias</h2>

      <p className="text-lg">
        Plugin: <strong>{plugin.nombre}</strong>
      </p>

      {/* ========= Selector de tipo de licencia ========= */}
      <div className="mt-4">
        <label className="font-semibold">Tipo de licencia:</label>
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          className="border p-2 rounded w-full dark:bg-gray-900"
        >
          {precioAnual > 0 && (
            <option value="anual">Anual – {precioAnual} €</option>
          )}

          {precioCompleta > 0 && (
            <option value="completa">Completa – {precioCompleta} €</option>
          )}
        </select>
      </div>

      {/* ========= Emails Tekla ========= */}
      <div>
        <h3 className="font-semibold mb-2">Emails Tekla:</h3>

        {emails.map((email, i) => (
          <input
            key={i}
            type="email"
            value={email}
            placeholder="usuario@empresa.com"
            onChange={(e) => actualizarEmail(i, e.target.value)}
            className="w-full p-2 border rounded mb-2 dark:bg-gray-900"
          />
        ))}

        <button
          onClick={añadirFila}
          className="text-blue-600 underline mb-4"
        >
          Añadir otro email
        </button>
      </div>

      {/* ========= Total ========= */}
      <p className="text-xl font-semibold">
        Total: {total} €
      </p>

      {error && <p className="text-red-600">{error}</p>}

      {/* ========= Botón comprar ========= */}
      <button
        onClick={comprar}
        className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
      >
        Comprar
      </button>
    </div>
  );
}