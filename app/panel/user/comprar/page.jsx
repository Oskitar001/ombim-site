"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, MailPlus } from "lucide-react";

export default function ComprarPage() {
  const router = useRouter();

  const [pluginId, setPluginId] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [emails, setEmails] = useState([""]);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");

  // 🟦 Cuando cambia la cantidad, ajustamos emails Tekla
  function actualizarCantidad(e) {
    const n = parseInt(e.target.value);
    setCantidad(n);

    const nuevos = [...emails];
    while (nuevos.length < n) nuevos.push("");
    while (nuevos.length > n) nuevos.pop();
    setEmails(nuevos);
  }

  // 🟦 Actualizar email individual
  function actualizarEmail(i, val) {
    const nuevos = [...emails];
    nuevos[i] = val;
    setEmails(nuevos);
  }

  // 🟦 Enviar compra
  async function comprar(e) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/pagos/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        plugin_id: pluginId,
        emails_tekla: emails,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setMensaje("Error al procesar la compra.");
      return;
    }

    setMensaje(
      "Compra registrada. Revisa tu email con instrucciones para la transferencia."
    );
  }

  return (
    <div className="space-y-8 max-w-xl mx-auto">

      {/* TÍTULO */}
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <CreditCard size={30} /> Comprar Licencias
      </h1>

      <p className="text-gray-600 dark:text-gray-300">
        Selecciona un plugin, indica cuántas licencias necesitas
        y escribe el email de Tekla para cada una.
      </p>

      {/* FORMULARIO */}
      <form onSubmit={comprar} className="space-y-6">

        {/* Plugin */}
        <div>
          <label className="block mb-1 font-semibold">Plugin</label>
          <select
            className="w-full border p-2 rounded dark:bg-[#1f1f1f]"
            value={pluginId}
            onChange={(e) => setPluginId(e.target.value)}
            required
          >
            <option value="">Seleccionar plugin…</option>
            <option value="plugin_1">Plugin 1</option>
            <option value="plugin_2">Plugin 2</option>
            <option value="plugin_3">Plugin 3</option>
          </select>
        </div>

        {/* Cantidad */}
        <div>
          <label className="block mb-1 font-semibold">Cantidad de licencias</label>
          <input
            type="number"
            min="1"
            max="50"
            value={cantidad}
            onChange={actualizarCantidad}
            className="w-full border p-2 rounded dark:bg-[#1f1f1f]"
            required
          />
        </div>

        {/* Emails Tekla */}
        <div className="space-y-4">
          <label className="font-semibold">Emails Tekla (uno por licencia)</label>

          {emails.map((email, i) => (
            <div key={i} className="flex items-center gap-2">
              <MailPlus className="text-gray-500" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => actualizarEmail(i, e.target.value)}
                placeholder={`Email Tekla #${i + 1}`}
                className="flex-1 border p-2 rounded dark:bg-[#1f1f1f]"
                required
              />
            </div>
          ))}
        </div>

        {/* BOTÓN */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded"
        >
          {loading ? "Procesando..." : "Finalizar compra"}
        </button>
      </form>

      {/* MENSAJE */}
      {mensaje && (
        <p className="mt-4 text-green-600 font-semibold dark:text-green-400">
          {mensaje}
        </p>
      )}
    </div>
  );
}