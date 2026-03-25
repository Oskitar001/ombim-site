"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, MailPlus } from "lucide-react";

export default function ComprarPage() {
  const router = useRouter();

  const [pluginId, setPluginId] = useState("");
  const [plugins, setPlugins] = useState([]);
  const [cantidad, setCantidad] = useState(1);
  const [emails, setEmails] = useState([""]);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");

  // ===========================
  // CARGAR PLUGINS REALES
  // ===========================
  useEffect(() => {
    async function load() {
      try {
        const r = await fetch("/api/user/plugins", {
          credentials: "include",
        });

        const d = await r.json();
        setPlugins(d.plugins ?? []);
      } catch (err) {
        console.error("Error cargando plugins:", err);
        setPlugins([]);
      }
    }
    load();
  }, []);

  // ===========================
  // CAMBIA CANTIDAD → AJUSTAR EMAILS
  // ===========================
  function actualizarCantidad(e) {
    const n = parseInt(e.target.value);
    setCantidad(n);

    const nuevos = [...emails];
    while (nuevos.length < n) nuevos.push("");
    while (nuevos.length > n) nuevos.pop();

    setEmails(nuevos);
  }

  // ===========================
  // ACTUALIZAR EMAIL INDIVIDUAL
  // ===========================
  function actualizarEmail(i, val) {
    const nuevos = [...emails];
    nuevos[i] = val;
    setEmails(nuevos);
  }

  // ===========================
  // ENVIAR COMPRA
  // ===========================
  async function comprar(e) {
    e.preventDefault();
    setLoading(true);
    setMensaje("");

    const res = await fetch("/api/pagos/create", {
      method: "POST",
      credentials: "include",
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
    <div>
      {/* TÍTULO */}
      <h2 className="text-2xl font-bold mb-4">Comprar Licencias</h2>
      <p className="mb-4">
        Selecciona un plugin, indica cuántas licencias necesitas y escribe el email de Tekla para cada una.
      </p>

      {/* FORMULARIO */}
      <form onSubmit={comprar} className="space-y-4">

        {/* PLUGIN */}
        <div>
          <label className="block mb-1">Plugin</label>
          <select
            className="border p-2 rounded w-full"
            value={pluginId}
            onChange={(e) => setPluginId(e.target.value)}
            required
          >
            <option value="">Seleccionar plugin…</option>

            {plugins.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre} (v{p.version})
              </option>
            ))}
          </select>
        </div>

        {/* CANTIDAD */}
        <div>
          <label className="block mb-1">Cantidad de licencias</label>
          <input
            type="number"
            className="border p-2 rounded w-full"
            min="1"
            value={cantidad}
            onChange={actualizarCantidad}
            required
          />
        </div>

        {/* EMAILS */}
        <div>
          <label className="block mb-2">Emails Tekla (uno por licencia)</label>

          {emails.map((email, i) => (
            <div key={i} className="mb-2">
              <input
                type="email"
                className="flex-1 border p-2 rounded w-full"
                placeholder={`Email Tekla #${i + 1}`}
                value={email}
                onChange={(e) => actualizarEmail(i, e.target.value)}
                required
              />
            </div>
          ))}
        </div>

        {/* BOTÓN */}
        <button
          className="w-full bg-blue-600 text-white py-2 rounded"
          disabled={loading}
        >
          {loading ? "Procesando..." : "Finalizar compra"}
        </button>
      </form>

      {/* MENSAJE */}
      {mensaje && (
        <p className="mt-4 p-2 bg-green-200 text-green-800 rounded">{mensaje}</p>
      )}
    </div>
  );
}