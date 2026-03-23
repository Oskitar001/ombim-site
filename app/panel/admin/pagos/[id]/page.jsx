"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPagoDetallePage({ params }) {
  const { id } = params;
  const router = useRouter();

  const [pago, setPago] = useState(null);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [numeroFactura, setNumeroFactura] = useState("");
  const [validFactura, setValidFactura] = useState(true);

  useEffect(() => {
    fetch(`/api/pagos/detalle?pago_id=${id}`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else {
          setPago(data);
          setNumeroFactura(data.numero_factura || "");
          setValidFactura(!!data.numero_factura);
        }
      });
  }, [id]);

  const validarFormato = (valor) => {
    const regex = /^\d{4}-\d{3}$/;
    return regex.test(valor);
  };

  const guardarNumeroFactura = async () => {
    if (!validarFormato(numeroFactura)) {
      setValidFactura(false);
      setError("Formato incorrecto. Ejemplo válido: 2024-001");
      return;
    }

    setError("");
    setMensaje("");

    const res = await fetch("/api/facturacion/guardar-numero", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ pago_id: id, numero_factura: numeroFactura }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Error guardando número de factura");
      return;
    }

    setMensaje("Número de factura guardado correctamente.");
    setValidFactura(true);
  };

  const aprobar = async () => {
    setError("");
    setMensaje("");

    const res = await fetch("/api/pagos/aprobar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ pago_id: id }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Error al aprobar pago");
      return;
    }

    setMensaje("Pago aprobado y licencias activadas.");
    setTimeout(() => router.push("/panel/admin/pagos"), 1500);
  };

  if (!pago && !error) {
    return <div className="pt-32 px-6">Cargando...</div>;
  }

  if (error) {
    return <div className="pt-32 px-6 text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-3xl mx-auto pt-32 px-6">
      <h1 className="text-2xl font-bold mb-4">Pago {pago.id}</h1>

      <p><strong>Usuario:</strong> {pago.user_id}</p>
      <p><strong>Plugin:</strong> {pago.plugin_id}</p>
      <p><strong>Licencias:</strong> {pago.cantidad_licencias}</p>
      <p><strong>Estado:</strong> {pago.estado}</p>

      {/* Número de factura */}
      <h2 className="text-xl font-semibold mt-6 mb-2">Número de factura</h2>

      <input
        type="text"
        value={numeroFactura}
        onChange={(e) => {
          setNumeroFactura(e.target.value);
          setValidFactura(validarFormato(e.target.value));
        }}
        className={`border p-2 rounded w-full ${
          validFactura ? "border-green-600" : "border-red-600"
        }`}
        placeholder="Ej: 2024-001"
      />

      {!validFactura && (
        <p className="text-red-600 text-sm mt-1">
          Formato incorrecto. Ejemplo válido: 2024-001
        </p>
      )}

      <button
        onClick={guardarNumeroFactura}
        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Guardar número de factura
      </button>

      {/* Botón ver factura */}
      {validFactura && pago.facturacion && (
        <button
          onClick={() =>
            window.open(`/api/facturacion/pdf?pago_id=${pago.id}`, "_blank")
          }
          className="mt-2 ml-2 bg-purple-600 text-white px-4 py-2 rounded"
        >
          Ver factura PDF
        </button>
      )}

      {!validFactura && (
        <p className="text-red-600 mt-2">
          No se puede ver la factura hasta que introduzcas un número válido.
        </p>
      )}

      {/* Factura solicitada */}
      <p className="mt-4">
        <strong>Factura solicitada:</strong>{" "}
        {pago.factura_solicitada ? "Sí" : "No"}
      </p>

      {/* Datos de facturación */}
      <h2 className="text-xl font-semibold mt-6 mb-2">Datos de facturación</h2>

      {pago.facturacion ? (
        <div className="border p-4 rounded space-y-1">
          <p><strong>Nombre:</strong> {pago.facturacion.nombre}</p>
          <p><strong>NIF:</strong> {pago.facturacion.nif}</p>
          <p><strong>Dirección:</strong> {pago.facturacion.direccion}</p>
          <p><strong>Ciudad:</strong> {pago.facturacion.ciudad}</p>
          <p><strong>CP:</strong> {pago.facturacion.cp}</p>
          <p><strong>País:</strong> {pago.facturacion.pais}</p>
          <p><strong>Teléfono:</strong> {pago.facturacion.telefono}</p>
        </div>
      ) : (
        <p className="text-red-600">El usuario no ha rellenado sus datos de facturación.</p>
      )}

      {/* Licencias */}
      <h2 className="text-xl font-semibold mt-6 mb-2">Licencias</h2>
      <ul className="space-y-2">
        {pago.licencias?.map((l) => (
          <li key={l.id} className="border p-2 rounded">
            <p><strong>Email Tekla:</strong> {l.email_tekla || "(sin asignar)"}</p>
            <p><strong>Estado:</strong> {l.estado}</p>
          </li>
        ))}
      </ul>

      <button
        onClick={aprobar}
        className="mt-6 bg-green-600 text-white px-4 py-2 rounded"
      >
        Aprobar pago y activar licencias
      </button>

      {mensaje && <p className="mt-4 text-green-600">{mensaje}</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
}
