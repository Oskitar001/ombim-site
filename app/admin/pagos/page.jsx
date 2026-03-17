"use client";
import { useEffect, useState } from "react";

export default function AdminPagos() {
  const [pagos, setPagos] = useState([]);

  useEffect(() => {
    fetch("/api/admin/pagos")
      .then(res => res.json())
      .then(data => setPagos(data));
  }, []);

  const confirmarPago = async (id) => {
    await fetch("/api/admin/confirmar-pago", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });

    setPagos(prev =>
      prev.map(p => p.id === id ? { ...p, estado: "confirmado" } : p)
    );
  };

  return (
    <div className="max-w-3xl mx-auto pt-32 px-6">
      <h1 className="text-3xl font-bold mb-6">Gestión de Pagos</h1>

      {pagos.map(p => (
        <div
          key={p.id}
          className="p-4 mb-4 rounded-lg border bg-white dark:bg-[#1a1a1a]"
        >
          <p><strong>Usuario:</strong> {p.user_email}</p>
          <p><strong>Plugin:</strong> {p.plugin_nombre}</p>
          <p><strong>Estado:</strong> {p.estado}</p>
          <p><strong>Fecha:</strong> {new Date(p.fecha).toLocaleString()}</p>

          {p.estado === "pendiente" && (
            <button
              onClick={() => confirmarPago(p.id)}
              className="mt-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Confirmar pago
            </button>
          )}

          {p.estado === "confirmado" && (
            <p className="mt-3 text-green-600 font-semibold">
              Pago confirmado ✔
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
