import { supabaseAdmin } from "./supabaseAdmin";

export async function guardarFactura({
  numeroFactura,
  cliente,
  lineas,
  usarRetencion,
  pedidos = [], // ✅ ARRAY
}) {
  const subtotal = lineas.reduce(
    (acc, l) => acc + (Number(l.precio) || 0) * (Number(l.cantidad) || 0),
    0
  );

  const iva = subtotal * 0.21;
  const retencion = usarRetencion ? subtotal * 0.15 : 0;
  const total = subtotal + iva - retencion;

  // ✅ LIMPIAR PEDIDOS
  const pedidosLimpios = pedidos
    ?.map(p => p.trim())
    .filter(p => p !== "")
    .join(" ") || "";

  // =========================
  // INSERT FACTURA
  // =========================
  const { data: factura, error: facturaErr } = await supabaseAdmin
    .from("facturas")
    .insert([
      {
        pedidos: pedidosLimpios, // ✅ CAMBIO CLAVE
        numero: numeroFactura,
        fecha: new Date(),
        cliente_nombre: cliente.nombre,
        cliente_nif: cliente.nif,
        cliente_direccion: cliente.direccion,
        cliente_ciudad: cliente.ciudad,
        cliente_cp: cliente.cp,
        cliente_telefono: cliente.telefono,
        subtotal,
        iva,
        retencion,
        total,
      },
    ])
    .select()
    .single();

  if (facturaErr) {
    console.error(facturaErr);
    throw new Error("Error guardando factura");
  }

  // =========================
  // INSERT LINEAS
  // =========================
  const lineasDb = lineas.map((l) => ({
    factura_id: factura.id,
    concepto: l.concepto,
    precio: l.precio,
    cantidad: l.cantidad,
    importe: (l.precio || 0) * (l.cantidad || 0),
  }));

  const { error: lineasErr } = await supabaseAdmin
    .from("factura_lineas")
    .insert(lineasDb);

  if (lineasErr) {
    console.error(lineasErr);
    throw new Error("Error guardando líneas");
  }

  return factura;
}