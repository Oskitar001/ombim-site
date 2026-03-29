"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";

export default function Page() {
  const { plugin_id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Tipo inicial (solo anual o completa)
  const planInicial = searchParams.get("plan") ?? "completa";

  const [plugin, setPlugin] = useState(null);
  const [user, setUser] = useState(null);
  const [emails, setEmails] = useState([""]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [tipo, setTipo] = useState(planInicial);

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

    if (plugin_id) load();
  }, [plugin_id]);

  function actualizarEmail(i, valor) {
    setEmails(prev => prev.map((e, idx) => (idx === i ? valor : e)));
  }

  function añadirFila() {
    setEmails(prev => [...prev, ""]);
  }

  async function crearPago() {
    if (!user) {
      router.push("/login");
      return;
    }

    const emailsLimpios = emails.map(e => e.trim());
    if (emailsLimpios.some(e => e === "")) {
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

  // PRECIOS BASE (sin IVA)
  const precioAnual = Number(plugin.precio_anual) || 0;
  const precioCompleta = Number(plugin.precio_completa) || 0;

  // PRECIO UNITARIO
  const precioUnitario = tipo === "anual" ? precioAnual : precioCompleta;

  // DESGLOSE IVA
  const subtotal = precioUnitario * emails.length;   // sin IVA
  const iva = subtotal * 0.21;
  const total = subtotal + iva;

  return (
    <div className="p-4 max-w-xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Comprar licencias</h1>

      <p className="text-lg">
        Plugin: <strong>{plugin.nombre}</strong>
      </p>

      {/* SELECTOR DE PLAN */}
      <div>
        <label className="font-semibold">Tipo de licencia:</label>

        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          className="border p-2 rounded w-full dark:bg-gray-900"
        >
          {precioAnual > 0 && (
            <option value="anual">Anual – {precioAnual.toFixed(2)} €</option>
          )}

          {precioCompleta > 0 && (
            <option value="completa">Completa – {precioCompleta.toFixed(2)} €</option>
          )}
        </select>
      </div>

      {/* EMAILS TEKLA */}
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

      {/* DESGLOSE DE PRECIOS (AQUÍ FALTABA EL IVA) */}
      <div className="space-y-1 text-lg">
        <p><strong>Subtotal:</strong> {subtotal.toFixed(2)} €</p>
        <p><strong>IVA (21%):</strong> {iva.toFixed(2)} €</p>
        <p className="text-2xl font-bold"><strong>Total:</strong> {total.toFixed(2)} €</p>
      </div>

      {error && <p className="text-red-600">{error}</p>}

      {/* BOTÓN COMPRAR */}
      <button
        onClick={crearPago}
        className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
      >
        Comprar
      </button>
    </div>
  );
}