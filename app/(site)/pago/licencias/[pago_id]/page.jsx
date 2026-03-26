"use client";

import { use, useEffect, useState } from "react";
import AsignarEmailsClient from "./AsignarEmailsClient";

export default function Page({ params }) {
  const { pago_id } = use(params);

  const [user, setUser] = useState(null);
  const [pago, setPago] = useState(null);
  const [empresa, setEmpresa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [emailsConfirmados, setEmailsConfirmados] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    async function load() {
      const rUser = await fetch("/api/auth/me");
      const dUser = await rUser.json();

      if (!dUser.user) {
        setUser(null);
        setLoading(false);
        return;
      }

      setUser(dUser.user);

      const rPago = await fetch(`/api/pagos/detalle?pago_id=${pago_id}`);
      const dPago = await rPago.json();
      setPago(dPago);

      const rEmpresa = await fetch("/api/empresa");
      const dEmpresa = await rEmpresa.json();
      setEmpresa(dEmpresa);

      setLoading(false);
    }

    load();
  }, [pago_id]);

  async function notificarTransferencia() {
    setMsg("");

    const res = await fetch("/api/pagos/notificar-transferencia", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pago_id }),
    });

    if (!res.ok) {
      setMsg("Error notificando la transferencia.");
      return;
    }

    setMsg("Notificación enviada. Te avisaremos cuando se valide.");
  }

  if (loading) return <p className="p-6">Cargando...</p>;
  if (!user) return <p className="p-6">Debes iniciar sesión.</p>;
  if (!pago) return <p className="p-6">Pago no encontrado.</p>;
  if (!empresa) return <p className="p-6">Error cargando empresa.</p>;

  const total = pago.cantidad_licencias * (pago.plugins?.precio ?? 0);

  return (
    <div className="max-w-xl mx-auto p-6 space-y-10">

      {/* PASO 1 */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-4">
        <h2 className="text-2xl font-bold">Paso 1: Confirmar Emails Tekla</h2>

        <AsignarEmailsClient
          pago={pago}
          onSaved={() => setEmailsConfirmados(true)}
        />
      </div>

      {/* PASO 2 */}
      {emailsConfirmados && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-6">
          <h2 className="text-2xl font-bold">Paso 2: Realizar la transferencia</h2>

          <div className="p-4 rounded bg-gray-100 dark:bg-gray-900 border space-y-2">
            {empresa.logo_url && (
              <img src={empresa.logo_url} className="w-32 mb-4" />
            )}

            <p className="text-lg font-bold">{empresa.nombre}</p>
            <p>CIF: {empresa.cif}</p>
            <p>{empresa.direccion}</p>
            <p>{empresa.cp} {empresa.ciudad}</p>
            <p>{empresa.pais}</p>

            <hr className="my-3" />

            <p><strong>Cuenta bancaria (IBAN):</strong><br />{empresa.iban}</p>
            <p><strong>Concepto:</strong> Pago #{pago_id}</p>
            <p><strong>Importe total:</strong> {total} €</p>
          </div>

          <button
            onClick={notificarTransferencia}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
          >
            Ya he hecho la transferencia
          </button>

          {msg && (
            <p className="text-green-600 font-semibold">{msg}</p>
          )}
        </div>
      )}

    </div>
  );
}