"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function AdminPagoDetallePage({ params }) {
  // Next.js 16 — params es una PROMESA
  const { id } = use(params);

  const [pago, setPago] = useState(null);
  const [emails, setEmails] = useState([]);
  const [facturacion, setFacturacion] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Estados de los diálogos
  const [openValidar, setOpenValidar] = useState(false);
  const [openRechazar, setOpenRechazar] = useState(false);
  const [openReenviar, setOpenReenviar] = useState(false);
  const [openBorrar, setOpenBorrar] = useState(false);

  // ============================================
  // CARGAR PAGO
  // ============================================
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

        setPago(data.pago ?? null);
        setFacturacion(data.facturacion ?? null);

        // emails asociados
        const listaEmails = Array.isArray(data.pago.emails)
          ? data.pago.emails
          : [];

        setEmails(listaEmails);
      } catch {
        setError("Error de conexión");
      } finally {
        setLoading(false);
      }
    }

    if (id) load();
  }, [id]);

  // ============================================
  // ACCIONES BACKEND
  // ============================================

  async function confirmarValidacion() {
    const r = await fetch("/api/admin/pagos/validar", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pago_id: id, emails_tekla: emails }),
    });

    const d = await r.json();
    if (!r.ok) return alert("Error validando pago: " + d.error);

    alert("Pago validado correctamente.");
    location.reload();
  }

  async function confirmarRechazo() {
    const r = await fetch("/api/admin/pagos/rechazar", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pago_id: id }),
    });

    const d = await r.json();
    if (!r.ok) return alert("Error rechazando pago: " + d.error);

    alert("Pago rechazado.");
    location.reload();
  }

  async function confirmarReenvio() {
    const r = await fetch("/api/email/compra", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pago_id: id }),
    });

    const d = await r.json();
    if (!r.ok) return alert("Error enviando email: " + d.error);

    alert("Email reenviado.");
  }

  async function confirmarBorrado() {
    const r = await fetch("/api/admin/pagos/borrar-todos", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    const d = await r.json();
    if (!r.ok) return alert("Error borrando pagos: " + d.error);

    window.location.href = "/panel/admin/pagos?deleted=1";
  }

  // ============================================
  // RENDER
  // ============================================
  if (loading) return <p>Cargando…</p>;
  if (error) return <p>{error}</p>;
  if (!pago) return <p>Pago no encontrado.</p>;

  return (
    <>
      {/* VOLVER */}
      <Link href="/panel/admin/pagos" className="text-blue-600 hover:underline">
        ← Volver
      </Link>

      <h2 className="text-2xl font-bold mt-4">Pago #{pago.id}</h2>

      {/* DATOS JSON DEL PAGO */}
      <h3 className="mt-6 font-semibold text-lg">Datos del pago</h3>
      <pre className="p-3 rounded bg-gray-100 dark:bg-gray-800 text-sm mt-2">
        {JSON.stringify(pago, null, 2)}
      </pre>

      {/* ============================================
          EMAILS TEKLA — EDITABLES
         ============================================ */}
      <h3 className="mt-6 font-semibold text-lg">Emails Tekla</h3>

      {emails.length === 0 && (
        <p className="text-gray-500 mt-2">No hay emails asociados.</p>
      )}

      {emails.length > 0 && (
        <div className="flex flex-col gap-3 mt-3">
          {emails.map((email, i) => (
            <input
              key={i}
              value={email}
              onChange={(ev) => {
                const copia = [...emails];
                copia[i] = ev.target.value;
                setEmails(copia);
              }}
              className="border p-2 rounded dark:bg-gray-900"
              placeholder={`Email Tekla #${i + 1}`}
            />
          ))}

          <button
            onClick={async () => {
              const vacios = emails.some((x) => !x || x.trim() === "");
              if (vacios) {
                alert("Todos los emails Tekla deben estar completos.");
                return;
              }

              const r = await fetch("/api/pagos/guardar-emails", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  pago_id: pago.id,
                  emails: emails.map((email) => ({
                    licencia_id: null,
                    email_tekla: email.trim(),
                  })),
                }),
              });

              const d = await r.json();
              if (!r.ok) return alert("Error guardando emails: " + d.error);

              alert("Emails guardados correctamente.");
            }}
            className="bg-blue-600 text-white py-2 rounded"
          >
            Guardar emails
          </button>
        </div>
      )}

      {/* ============================================
          FACTURACIÓN — BONITO
         ============================================ */}
      <h3 className="mt-6 font-semibold text-lg">Datos de facturación</h3>

      {!facturacion && (
        <p className="text-gray-500 mt-2">No hay datos de facturación.</p>
      )}

      {facturacion && (
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded mt-2 text-sm flex flex-col gap-1">
          <p><strong>Nombre / Razón social:</strong> {facturacion.nombre || "—"}</p>
          <p><strong>NIF / CIF:</strong> {facturacion.nif || "—"}</p>
          <p><strong>Dirección:</strong> {facturacion.direccion || "—"}</p>
          <p><strong>Ciudad:</strong> {facturacion.ciudad || "—"}</p>
          <p><strong>Código postal:</strong> {facturacion.cp || "—"}</p>
          <p><strong>País:</strong> {facturacion.pais || "—"}</p>
          <p><strong>Teléfono:</strong> {facturacion.telefono || "—"}</p>
        </div>
      )}

      {/* BOTONES */}
      <div className="mt-8 flex flex-col gap-3 max-w-sm">
        <button
          onClick={() => setOpenValidar(true)}
          className="btn bg-green-600 text-white"
        >
          ✔ Validar pago
        </button>

        <button
          onClick={() => setOpenRechazar(true)}
          className="btn bg-orange-600 text-white"
        >
          ✖ Rechazar pago
        </button>

        <button
          onClick={() => setOpenReenviar(true)}
          className="btn bg-blue-600 text-white"
        >
          📧 Reenviar email
        </button>

        <button
          onClick={() => setOpenBorrar(true)}
          className="btn bg-red-600 text-white"
        >
          🗑 Borrar pago(s)
        </button>
      </div>

      {/* ============================================
          DIALOGOS DE CONFIRMACIÓN
         ============================================ */}

      {/* VALIDAR */}
      <ConfirmDialog
        open={openValidar}
        title="Validar pago"
        description="Se crearán las licencias asociadas."
        confirmText="Validar"
        cancelText="Cancelar"
        onCancel={() => setOpenValidar(false)}
        onConfirm={confirmarValidacion}
      />

      {/* RECHAZAR */}
      <ConfirmDialog
        open={openRechazar}
        title="Rechazar pago"
        description="El usuario no podrá usar este pago."
        confirmText="Rechazar"
        cancelText="Cancelar"
        onCancel={() => setOpenRechazar(false)}
        onConfirm={confirmarRechazo}
      />

      {/* REENVIAR */}
      <ConfirmDialog
        open={openReenviar}
        title="Reenviar email"
        description="Se enviará de nuevo el email de compra."
        confirmText="Reenviar"
        cancelText="Cancelar"
        onCancel={() => setOpenReenviar(false)}
        onConfirm={confirmarReenvio}
      />

      {/* BORRAR */}
      <ConfirmDialog
        open={openBorrar}
        title="¿Borrar este pago y duplicados?"
        description="Esta acción no se puede deshacer."
        confirmText="Borrar todos"
        cancelText="Cancelar"
        onCancel={() => setOpenBorrar(false)}
        onConfirm={confirmarBorrado}
      />
    </>
  );
}