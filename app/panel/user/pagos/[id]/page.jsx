"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  FileDown,
  CheckCircle,
  Clock,
  Ban,
  Calendar,
} from "lucide-react";

/* Badge PREMIUM por estado */
function BadgeEstado({ estado }) {
  const styles = {
    pendiente: "bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    aprobado: "bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200",
    bloqueado: "bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200",
  };

  const icons = {
    pendiente: <Clock size={14} />,
    aprobado: <CheckCircle size={14} />,
    bloqueado: <Ban size={14} />,
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold 
        ${styles[estado] ?? "bg-gray-200 dark:bg-gray-700"}
      `}
    >
      {icons[estado]} {estado}
    </span>
  );
}

/* Contenedor premium */
function UserSection({ title, children }) {
  return (
    <section
      className="
        bg-white dark:bg-gray-900 
        border border-gray-300 dark:border-gray-700
        rounded-xl shadow p-6 space-y-4
      "
    >
      {title && (
        <h3 className="text-xl font-bold border-b border-gray-300 dark:border-gray-700 pb-2">
          {title}
        </h3>
      )}
      {children}
    </section>
  );
}

/* Campo premium */
function Field({ label, children }) {
  return (
    <p>
      <strong>{label}: </strong>
      <span className="text-gray-700 dark:text-gray-300">{children}</span>
    </p>
  );
}

export default function UserPagoDetallePage() {
  const params = useParams();
  const id = params.id;

  const [pago, setPago] = useState(null);
  const [plugin, setPlugin] = useState(null);
  const [licencias, setLicencias] = useState([]);
  const [facturacion, setFacturacion] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =======================================
     CARGA
  ======================================= */
  useEffect(() => {
    async function load() {
      try {
        // 1) PAGO
        const rPago = await fetch(`/api/pagos/detalle/${id}`, {
          credentials: "include",
        });
        const dPago = await rPago.json();

        if (!rPago.ok) {
          setError(dPago.error ?? "Error cargando pago");
          setLoading(false);
          return;
        }

        setPago(dPago);

        // 2) Plugin
        const rPlugin = await fetch(`/api/plugin/${dPago.plugin_id}`);
        setPlugin(await rPlugin.json());

        // 3) Licencias vinculadas
        const rLic = await fetch(`/api/user/licencias?pago_id=${id}`);
        const dLic = await rLic.json();
        setLicencias(dLic.licencias ?? []);

        // 4) Facturación
        const rFact = await fetch(`/api/user/facturacion`);
        const dFact = await rFact.json();
        setFacturacion(dFact ?? null);
      } catch (err) {
        setError("Error de conexión");
      } finally {
        setLoading(false);
      }
    }

    if (id) load();
  }, [id]);

  if (loading) return <p className="p-4">Cargando pago…</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;
  if (!pago) return <p className="p-4">Pago no encontrado.</p>;

  /* Valores seguros */
  const subtotal = pago.importe_base ?? 0;
  const iva = pago.iva ?? 0;
  const total = pago.importe ?? subtotal + iva;

  /* Descargar factura PDF */
  async function descargarFactura() {
    const res = await fetch("/api/facturacion/pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pagoId: pago.id }),
    });

    if (!res.ok) {
      const data = await res.json();
      alert(data.mensaje ?? "Error generando factura");
      return;
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `factura-${pago.id}.pdf`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  /* Solicitar factura */
  async function solicitarFactura() {
    const r = await fetch("/api/facturacion/solicitar", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pagoId: pago.id }),
    });

    if (!r.ok) {
      alert("Error solicitando la factura.");
      return;
    }

    alert("Solicitud enviada. El administrador debe asignar un número de factura.");
  }

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-10">

      {/* Volver */}
      <Link
        href="/panel/user/pagos"
        className="flex items-center gap-2 text-blue-600 hover:underline"
      >
        <ArrowLeft size={18} />
        Volver
      </Link>

      {/* Título */}
      <h2 className="text-3xl font-bold">Pago #{pago.id}</h2>

      {/* ==================================
          RESUMEN PREMIUM
      ================================== */}
      <UserSection title="Resumen del pago">
        <Field label="Plugin">{plugin?.nombre}</Field>

        <Field label="Estado">
          <BadgeEstado estado={pago.estado} />
        </Field>

        <Field label="Tipo licencia">{pago.tipo}</Field>

        <Field label="Cantidad">{pago.cantidad_licencias}</Field>

        <Field label="Fecha">
          {pago.fecha ? new Date(pago.fecha).toLocaleString() : "—"}
        </Field>

        <div className="pt-4 space-y-1">
          <Field label="Subtotal">{subtotal.toFixed(2)} €</Field>
          <Field label="IVA 21%">{iva.toFixed(2)} €</Field>
          <p className="text-xl font-bold">Total: {total.toFixed(2)} €</p>
        </div>

        {/* Factura: solicitar / descargar */}
        {pago.estado === "aprobado" && (
          <>
            {pago.numero_factura ? (
              <button
                onClick={descargarFactura}
                className="
                  mt-4 flex items-center gap-2 
                  bg-blue-600 hover:bg-blue-700
                  text-white px-4 py-2 rounded-lg shadow
                "
              >
                <FileDown size={18} />
                Descargar factura en PDF
              </button>
            ) : (
              <button
                onClick={solicitarFactura}
                className="
                  mt-4 flex items-center gap-2 
                  bg-yellow-600 hover:bg-yellow-700
                  text-white px-4 py-2 rounded-lg shadow
                "
              >
                Solicitar factura
              </button>
            )}
          </>
        )}
      </UserSection>

      {/* ==================================
          LICENCIAS VINCULADAS
      ================================== */}
      <UserSection title="Licencias vinculadas">
        {!licencias.length ? (
          <p>No hay licencias asociadas.</p>
        ) : (
          <ul className="space-y-2">
            {licencias.map((l) => (
              <li
                key={l.id}
                className="
                  p-3 rounded-lg 
                  bg-gray-100 dark:bg-gray-800 
                  border border-gray-300 dark:border-gray-700
                "
              >
                <strong>Email Tekla: </strong>
                {l.email_tekla ?? "—"} —{" "}
                <strong>Estado: </strong>
                {l.estado}
              </li>
            ))}
          </ul>
        )}
      </UserSection>

      {/* ==================================
          FACTURACIÓN
      ================================== */}
      <UserSection title="Datos de facturación">
        {!facturacion ? (
          <p>No hay datos guardados.</p>
        ) : (
          <div className="space-y-1">
            <Field label="Nombre">{facturacion.nombre}</Field>
            <Field label="NIF">{facturacion.nif ?? "—"}</Field>
            <Field label="Dirección">{facturacion.direccion}</Field>
            <Field label="Ciudad">{facturacion.ciudad}</Field>
            <Field label="País">{facturacion.pais}</Field>
          </div>
        )}
      </UserSection>
    </div>
  );
}
