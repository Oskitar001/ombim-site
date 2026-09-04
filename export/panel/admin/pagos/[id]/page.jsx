"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import ConfirmDialog from "@/components/ConfirmDialog";

import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Mail,
  Trash2,
  BadgeCheck,
} from "lucide-react";

export default function AdminPagoDetallePage() {
  const params = useParams();
  const id = params.id;

  const [pago, setPago] = useState(null);
  const [facturacion, setFacturacion] = useState(null);
  const [numeroFactura, setNumeroFactura] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [openValidar, setOpenValidar] = useState(false);
  const [openRechazar, setOpenRechazar] = useState(false);
  const [openReenviar, setOpenReenviar] = useState(false);
  const [openBorrar, setOpenBorrar] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const r = await fetch(`/api/admin/pagos/detalle/${id}`, {
          credentials: "include",
        });

        const data = await r.json();

        if (!r.ok) {
          setError(data.error ?? "Error cargando el pago");
          setLoading(false);
          return;
        }

        setPago(data.pago);
        setNumeroFactura(data.pago.numero_factura ?? "");
        setFacturacion(data.facturacion ?? null);

      } catch {
        setError("Error de conexión.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  async function guardarNumeroFactura() {
    if (!numeroFactura.trim()) {
      return alert("Debes introducir un número de factura.");
    }

    const r = await fetch("/api/admin/pagos/numero-factura", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pago_id: id,
        numero_factura: numeroFactura.trim(),
      }),
    });

    if (!r.ok) return alert("Error guardando número de factura");

    alert("Número guardado correctamente.");
    window.location.reload();
  }

  async function confirmarValidacion() {
    const r = await fetch("/api/admin/pagos/validar", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pago_id: id }),
    });

    if (!r.ok) return alert("Error validando el pago.");
    window.location.reload();
  }

  async function confirmarRechazo() {
    const r = await fetch("/api/admin/pagos/rechazar", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pago_id: id }),
    });

    if (!r.ok) return alert("Error rechazando el pago.");
    window.location.reload();
  }

  async function confirmarReenvio() {
    const r = await fetch("/api/email/compra", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pago_id: id }),
    });

    if (!r.ok) return alert("Error reenviando email.");
    alert("Email reenviado.");
  }

  async function confirmarBorrado() {
    const r = await fetch("/api/admin/pagos/borrar-todos", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (!r.ok) return alert("Error borrando el pago.");
    window.location.href = "/panel/admin/pagos?deleted=1";
  }

  if (loading) return <p>Cargando…</p>;
  if (error) return <p>{error}</p>;
  if (!pago) return <p>Pago no encontrado.</p>;

  return (
    <div className="max-w-3xl mx-auto space-y-10 p-4">

      {/* VOLVER */}
      <Link
        href="/panel/admin/pagos"
        className="text-blue-600 hover:underline flex items-center gap-1"
      >
        <ArrowLeft size={18} /> Volver
      </Link>

      {/* TITULO */}
      <h1 className="text-3xl font-bold">Pago #{pago.id}</h1>

      {/* FACTURA */}
      <Section title="Factura">
        <div className="space-y-3">

          {pago.numero_factura && (
            <Badge color="blue">
              <BadgeCheck size={14} /> Factura lista
            </Badge>
          )}

          {!pago.numero_factura && pago.factura_solicitada && (
            <Badge color="yellow">
              📄 Factura solicitada por el usuario
            </Badge>
          )}

          {!pago.numero_factura && !pago.factura_solicitada && (
            <Badge color="gray">— No solicitada —</Badge>
          )}

          <label className="font-semibold block">Número de factura</label>
          <input
            type="text"
            value={numeroFactura}
            onChange={(e) => setNumeroFactura(e.target.value)}
            className="w-full border p-2 rounded dark:bg-gray-800"
          />

          <button
            onClick={guardarNumeroFactura}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Guardar número
          </button>
        </div>
      </Section>

      {/* RESUMEN */}
      <Section title="Resumen económico">
        <Field label="Tipo" value={pago.tipo} />
        <Field label="Licencias" value={pago.cantidad_licencias} />
        <Field label="Estado" value={pago.estado} />

        <div className="mt-4 space-y-1">
          <p><strong>Subtotal:</strong> {pago.importe_base.toFixed(2)} €</p>
          <p><strong>IVA:</strong> {pago.iva.toFixed(2)} €</p>
          <p className="text-xl font-bold">
            Total: {pago.importe.toFixed(2)} €
          </p>
        </div>
      </Section>

      {/* FACTURACIÓN */}
      <Section title="Datos de facturación">
        {!facturacion && (
          <p className="text-gray-500">No hay datos de facturación.</p>
        )}

        {facturacion && (
          <div className="grid gap-2 text-sm">
            <Field label="Nombre" value={facturacion.nombre} />
            <Field label="NIF" value={facturacion.nif} />
            <Field label="Dirección" value={facturacion.direccion} />
            <Field label="Ciudad" value={facturacion.ciudad} />
            <Field label="CP" value={facturacion.cp} />
            <Field label="País" value={facturacion.pais} />
            <Field label="Teléfono" value={facturacion.telefono} />
          </div>
        )}
      </Section>

      {/* ACCIONES */}
      <Section title="Acciones">
        <div className="space-y-3 max-w-sm">

          <ActionButton color="green" onClick={() => setOpenValidar(true)}>
            <CheckCircle size={18} /> Validar pago
          </ActionButton>

          <ActionButton color="orange" onClick={() => setOpenRechazar(true)}>
            <XCircle size={18} /> Rechazar pago
          </ActionButton>

          <ActionButton color="blue" onClick={() => setOpenReenviar(true)}>
            <Mail size={18} /> Reenviar email
          </ActionButton>

          <ActionButton color="red" onClick={() => setOpenBorrar(true)}>
            <Trash2 size={18} /> Borrar pago(s)
          </ActionButton>
        </div>
      </Section>

      {/* DIALOGOS */}
      <ConfirmDialog
        open={openValidar}
        title="Validar pago"
        description="Se crearán las licencias asociadas."
        confirmText="Validar"
        cancelText="Cancelar"
        onCancel={() => setOpenValidar(false)}
        onConfirm={confirmarValidacion}
      />

      <ConfirmDialog
        open={openRechazar}
        title="Rechazar pago"
        description="El usuario no podrá usar este pago."
        confirmText="Rechazar"
        cancelText="Cancelar"
        onCancel={() => setOpenRechazar(false)}
        onConfirm={confirmarRechazo}
      />

      <ConfirmDialog
        open={openReenviar}
        title="Reenviar email"
        description="Se enviará de nuevo el email de compra."
        confirmText="Reenviar"
        cancelText="Cancelar"
        onCancel={() => setOpenReenviar(false)}
        onConfirm={confirmarReenvio}
      />

      <ConfirmDialog
        open={openBorrar}
        title="¿Borrar este pago y duplicados?"
        description="Esta acción no se puede deshacer."
        confirmText="Borrar"
        cancelText="Cancelar"
        onCancel={() => setOpenBorrar(false)}
        onConfirm={confirmarBorrado}
      />
    </div>
  );
}

/* COMPONENTES */

function Section({ title, children }) {
  return (
    <div className="bg-white dark:bg-gray-900 border rounded-xl p-6 space-y-4">
      <h2 className="text-xl font-bold border-b pb-2">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, value }) {
  return (
    <p><strong>{label}:</strong> {value}</p>
  );
}

function Badge({ children, color }) {
  const styles = {
    blue: "bg-blue-200 text-blue-900",
    yellow: "bg-yellow-200 text-yellow-900",
    gray: "bg-gray-300 text-gray-900",
  };

  return (
    <span className={`px-3 py-1 rounded text-xs font-semibold ${styles[color]}`}>
      {children}
    </span>
  );
}

function ActionButton({ children, color, onClick }) {
  const styles = {
    green: "bg-green-600 hover:bg-green-700",
    orange: "bg-orange-600 hover:bg-orange-700",
    blue: "bg-blue-600 hover:bg-blue-700",
    red: "bg-red-600 hover:bg-red-700",
  };

  return (
    <button
      onClick={onClick}
      className={`${styles[color]} text-white w-full py-2 rounded-lg flex items-center justify-center gap-2`}
    >
      {children}
    </button>
  );
}
