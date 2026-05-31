"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditFacturaPage() {
  const { id } = useParams();

  const [cliente, setCliente] = useState({
    nombre: "",
    nif: "",
    direccion: "",
    ciudad: "",
    cp: "",
    telefono: "",
  });

  const [lineas, setLineas] = useState([]);
  const [pedidos, setPedidos] = useState([""]);
  const [usarRetencion, setUsarRetencion] = useState(true);

  // =====================
  // CARGAR FACTURA
  // =====================
  useEffect(() => {
    async function loadFactura() {
      const res = await fetch(`/api/admin/facturas/${id}`);
      const data = await res.json();

      const f = data.factura;

      setCliente({
        nombre: f.cliente_nombre,
        nif: f.cliente_nif,
        direccion: f.cliente_direccion,
        ciudad: f.cliente_ciudad,
        cp: f.cliente_cp,
        telefono: f.cliente_telefono,
      });

     let pedidosArray = [""];

        if (f?.pedidos && f.pedidos.trim() !== "") {
        pedidosArray = f.pedidos
            .split(" ")
            .map(p => p.trim())
            .filter(p => p.length > 0);
        }

        if (pedidosArray.length === 0) pedidosArray = [""];

        setPedidos(pedidosArray);

      setLineas(
        data.lineas.map(l => ({
          concepto: l.concepto,
          precio: l.precio,
          cantidad: l.cantidad
        }))
      );

      setUsarRetencion(f.retencion > 0);
    }

    loadFactura();
  }, [id]);

  // =====================
  // GUARDAR + PDF
  // =====================
async function guardarYGenerar() {
  // ✅ 1. guardar cambios
  const res = await fetch(`/api/admin/facturas/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      cliente,
      lineas,
      pedidos,
      usarRetencion,
    }),
  });

  if (!res.ok) {
    alert("Error guardando factura");
    return;
  }

  // ✅ 2. abrir PDF de ESA factura (sin crear nueva)
  window.open(`/api/admin/facturas/pdf?id=${id}`, "_blank");
}

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Editar factura</h1>

      {/* ================= CLIENTE ================= */}
      <div className="bg-white p-4 mb-6 rounded shadow">
        <h2 className="font-semibold">Cliente</h2>

        <input value={cliente.nombre} onChange={e => setCliente({...cliente, nombre:e.target.value})} placeholder="Nombre" className="input-premium w-full mb-2" />
        <input value={cliente.nif} onChange={e => setCliente({...cliente, nif:e.target.value})} placeholder="NIF" className="input-premium w-full mb-2" />
        <input value={cliente.direccion} onChange={e => setCliente({...cliente, direccion:e.target.value})} placeholder="Dirección" className="input-premium w-full mb-2" />
        <input value={cliente.ciudad} onChange={e => setCliente({...cliente, ciudad:e.target.value})} placeholder="Ciudad" className="input-premium w-full mb-2" />
        <input value={cliente.cp} onChange={e => setCliente({...cliente, cp:e.target.value})} placeholder="CP" className="input-premium w-full mb-2" />
      </div>

      {/* ================= LINEAS ================= */}
      <div className="bg-white p-4 mb-6 rounded shadow">
        <h2 className="font-semibold">Conceptos</h2>

        {lineas.map((l, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              value={l.concepto}
              onChange={e => {
                const nuevas = [...lineas];
                nuevas[i].concepto = e.target.value;
                setLineas(nuevas);
              }}
              className="input-premium flex-1"
            />
            <input
              type="number"
              value={l.precio}
              onChange={e => {
                const nuevas = [...lineas];
                nuevas[i].precio = e.target.value;
                setLineas(nuevas);
              }}
              className="input-premium w-24"
            />
            <input
              type="number"
              value={l.cantidad}
              onChange={e => {
                const nuevas = [...lineas];
                nuevas[i].cantidad = e.target.value;
                setLineas(nuevas);
              }}
              className="input-premium w-20"
            />
          </div>
        ))}
      </div>

      {/* ================= PEDIDOS ================= */}
      <div className="bg-white p-4 mb-6 rounded shadow">
        <h2 className="font-semibold">Pedidos</h2>

        {pedidos.map((p, i) => (
          <input
            key={i}
            value={p}
            onChange={e => {
              const nuevos = [...pedidos];
              nuevos[i] = e.target.value;
              setPedidos(nuevos);
            }}
            className="input-premium w-full mb-2"
          />
        ))}
      </div>

      <button
        onClick={guardarYGenerar}
        className="bg-green-600 text-white px-6 py-3 rounded"
      >
        Guardar y generar PDF
      </button>
    </div>
  );
}