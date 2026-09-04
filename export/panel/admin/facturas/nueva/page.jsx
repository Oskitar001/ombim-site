"use client";

import { useEffect, useState } from "react";

export default function NuevaFacturaPage() {
  // =========================
  // ESTADOS
  // =========================
  const [cliente, setCliente] = useState({
    nombre: "",
    nif: "",
    direccion: "",
    ciudad: "",
    cp: "",
    telefono: "",
  });

  const [lineas, setLineas] = useState([
    { concepto: "", precio: 0, cantidad: 1 },
  ]);

  const [usarRetencion, setUsarRetencion] = useState(true);

  const [clientesGuardados, setClientesGuardados] = useState([]);

  // ✅ múltiples pedidos
  const [pedidos, setPedidos] = useState([""]);

  // =========================
  // CARGAR CLIENTES
  // =========================
  useEffect(() => {
    async function loadClientes() {
      try {
        const res = await fetch("/api/admin/clientes");
        const data = await res.json();
        setClientesGuardados(data.clientes || []);
      } catch {
        setClientesGuardados([]);
      }
    }
    loadClientes();
  }, []);

  // =========================
  // LINEAS
  // =========================
  function actualizarLinea(index, campo, valor) {
    const nuevas = [...lineas];
    nuevas[index][campo] = valor;
    setLineas(nuevas);
  }

  function añadirLinea() {
    setLineas([...lineas, { concepto: "", precio: 0, cantidad: 1 }]);
  }

  function eliminarLinea(index) {
    setLineas(lineas.filter((_, i) => i !== index));
  }

  // =========================
  // CALCULOS
  // =========================
  const subtotal = lineas.reduce(
    (acc, l) => acc + (Number(l.precio) || 0) * (Number(l.cantidad) || 0),
    0
  );

  const iva = subtotal * 0.21;
  const retencion = usarRetencion ? subtotal * 0.15 : 0;
  const total = subtotal + iva - retencion;

  // =========================
  // GENERAR PDF
  // =========================
  async function generarFactura() {
    const res = await fetch("/api/facturacion/pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        manual: true,
        cliente,
        lineas,
        usarRetencion,
        pedidos, // ✅ ahora array
      }),
    });

    if (!res.ok) {
      alert("Error generando factura");
      return;
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `factura.pdf`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

 return (
  <div className="max-w-6xl mx-auto">
    <h1 className="text-2xl font-bold mb-6">Nueva factura manual</h1>

    {/* ================= CLIENTE ================= */}
    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg mb-6 shadow">
      <h2 className="font-semibold mb-4">Datos cliente</h2>

      {/* SELECTOR */}
      <select
        onChange={(e) => {
 const c = clientesGuardados.find(
  x => x.id === e.target.value
);
          if (!c) return;

          setCliente({
            nombre: c.nombre,
            nif: c.nif,
            direccion: c.direccion,
            ciudad: c.ciudad,
            cp: c.cp,
            telefono: c.telefono,
          });
        }}
        className="input-premium mb-4 w-full"
      >
        <option value="">Seleccionar cliente guardado</option>
        {clientesGuardados.map(c => (
          <option key={c.id} value={c.id}>
            {c.nombre}
          </option>
        ))}
      </select>

      {/* INPUTS CLIENTE */}
      <div className="grid grid-cols-2 gap-4">
        <input
          placeholder="Nombre / Empresa"
          value={cliente.nombre}
          onChange={(e) => setCliente({ ...cliente, nombre: e.target.value })}
          className="input-premium"
        />

        <input
          placeholder="NIF / CIF"
          value={cliente.nif}
          onChange={(e) => setCliente({ ...cliente, nif: e.target.value })}
          className="input-premium"
        />

        <input
          placeholder="Dirección"
          value={cliente.direccion}
          onChange={(e) => setCliente({ ...cliente, direccion: e.target.value })}
          className="input-premium col-span-2"
        />

        <input
          placeholder="Ciudad"
          value={cliente.ciudad}
          onChange={(e) => setCliente({ ...cliente, ciudad: e.target.value })}
          className="input-premium"
        />

        <input
          placeholder="CP"
          value={cliente.cp}
          onChange={(e) => setCliente({ ...cliente, cp: e.target.value })}
          className="input-premium"
        />

        <input
          placeholder="Teléfono"
          value={cliente.telefono}
          onChange={(e) => setCliente({ ...cliente, telefono: e.target.value })}
          className="input-premium col-span-2"
        />
      </div>

      {/* ================= PEDIDOS ================= */}
      <h3 className="mt-4 font-semibold">Números de pedido</h3>

      {pedidos.map((p, i) => (
        <div key={i} className="flex gap-2 mb-2">
          <input
            placeholder="Número de pedido"
            value={p}
            onChange={(e) => {
              const nuevos = [...pedidos];
              nuevos[i] = e.target.value;
              setPedidos(nuevos);
            }}
            className="input-premium w-full"
          />

          <button
            onClick={() =>
              setPedidos(pedidos.filter((_, index) => index !== i))
            }
            className="bg-red-500 text-white px-2 rounded"
          >
            X
          </button>
        </div>
      ))}

      <button
        onClick={() => setPedidos([...pedidos, ""])}
        className="bg-blue-600 text-white px-3 py-2 rounded"
      >
        + Añadir pedido
      </button>
    </div>

    {/* ================= LINEAS ================= */}
    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg mb-6 shadow">
      <h2 className="font-semibold mb-4">Conceptos</h2>

      {lineas.map((l, i) => (
        <div key={i} className="grid grid-cols-5 gap-3 mb-3">
          <input
            placeholder="Concepto"
            value={l.concepto}
            onChange={(e) =>
              actualizarLinea(i, "concepto", e.target.value)
            }
            className="input-premium col-span-2"
          />

          <input
            type="number"
            placeholder="Precio"
            value={l.precio}
            onChange={(e) =>
              actualizarLinea(i, "precio", e.target.value)
            }
            className="input-premium"
          />

          <input
            type="number"
            placeholder="Cantidad"
            value={l.cantidad}
            onChange={(e) =>
              actualizarLinea(i, "cantidad", e.target.value)
            }
            className="input-premium"
          />

          <button
            onClick={() => eliminarLinea(i)}
            className="bg-red-500 text-white rounded px-2"
          >
            X
          </button>
        </div>
      ))}

      <button
        onClick={añadirLinea}
        className="bg-blue-600 text-white px-3 py-2 rounded mt-2"
      >
        + Añadir línea
      </button>
    </div>

    {/* ================= TOTALES ================= */}
    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg mb-6 shadow">
      <h2 className="font-semibold mb-4">Totales</h2>

      <div className="space-y-2">
        <p>Subtotal: {subtotal.toFixed(2)} €</p>
        <p>IVA (21%): {iva.toFixed(2)} €</p>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={usarRetencion}
            onChange={(e) => setUsarRetencion(e.target.checked)}
          />
          Aplicar retención IRPF (15%)
        </label>

        {usarRetencion && (
          <p>RET (15%): -{retencion.toFixed(2)} €</p>
        )}

        <p className="text-lg font-bold">
          TOTAL: {total.toFixed(2)} €
        </p>
      </div>
    </div>

    {/* ================= BOTON ================= */}
    <button
      onClick={generarFactura}
      className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold"
    >
      Generar factura PDF
    </button>
  </div>
);

}