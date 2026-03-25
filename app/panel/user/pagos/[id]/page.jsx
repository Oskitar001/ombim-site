"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ConfirmDialog from "@/components/ConfirmDialog";
import { ArrowLeft, CreditCard, CheckCircle } from "lucide-react";

function Tooltip({ label, children }) {
  return (
    <span className="relative group">
      {children}
      <span className="absolute hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
        {label}
      </span>
    </span>
  );
}

export default function UserPagoDetallePage({ params }) {
  const { id } = params;
  const [pago, setPago] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const r = await fetch(`/api/pagos/detalle?pago_id=${id}`, {
          credentials: "include",
        });

        const data = await r.json();

        if (!r.ok) {
          setError(data.error ?? "Error cargando pago");
          return;
        }

        setPago(data);
      } catch (err) {
        setError("Error de conexión");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  if (loading) return <p className="p-4">Cargando pago…</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;
  if (!pago) return <p className="p-4">Pago no encontrado.</p>;

  const { licencias = [], facturacion } = pago;

  return (
    <div className="p-4">
      <Link href="/panel/user/pagos" className="flex items-center gap-2 text-blue-600 hover:underline">
        <ArrowLeft size={18} /> Volver
      </Link>

      <h2 className="text-2xl font-bold my-4">Pago #{pago.id}</h2>

      <p><strong>Estado:</strong> {pago.estado}</p>
      <p><strong>Cantidad:</strong> {pago.cantidad_licencias}</p>
      {pago.fecha && (
        <p>
          <strong>Fecha:</strong>{" "}
          {new Date(pago.fecha).toLocaleString()}
        </p>
      )}

      <h3 className="text-xl font-bold mt-6 mb-2">Licencias</h3>

      {!licencias.length ? (
        <p>No hay licencias asociadas.</p>
      ) : (
        <ul className="space-y-2">
          {licencias.map((l) => (
            <li key={l.id}>
              <strong>Email Tekla:</strong> {l.email_tekla ?? "—"} — 
              <strong> Estado:</strong> {l.estado}
            </li>
          ))}
        </ul>
      )}

      <h3 className="text-xl font-bold mt-6 mb-2">Datos de facturación</h3>

      {!facturacion ? (
        <p>No hay datos guardados.</p>
      ) : (
        <div className="space-y-1">
          <p><strong>Nombre:</strong> {facturacion.nombre}</p>
          <p><strong>NIF/CIF:</strong> {facturacion.nif ?? "—"}</p>
          <p><strong>Dirección:</strong> {facturacion.direccion}</p>
          <p><strong>Ciudad:</strong> {facturacion.ciudad}</p>
          <p><strong>País:</strong> {facturacion.pais}</p>
        </div>
      )}
    </div>
  );
}
