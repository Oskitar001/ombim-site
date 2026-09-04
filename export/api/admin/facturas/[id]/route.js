import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

export async function GET(req, context) {
  const { id } = await context.params;

  const { data: factura } = await supabaseAdmin
    .from("facturas")
    .select("*")
    .eq("id", id)
    .single();

  const { data: lineas } = await supabaseAdmin
    .from("factura_lineas")
    .select("*")
    .eq("factura_id", id);

  return NextResponse.json({ factura, lineas });
}

export async function PUT(req, context) {
  const { id } = await context.params;

  const { cliente, lineas, pedidos, usarRetencion } = await req.json();

  // actualizar factura
  await supabaseAdmin
    .from("facturas")
    .update({
      cliente_nombre: cliente.nombre,
      cliente_nif: cliente.nif,
      cliente_direccion: cliente.direccion,
      cliente_ciudad: cliente.ciudad,
      cliente_cp: cliente.cp,
      cliente_telefono: cliente.telefono,
      pedidos: pedidos
        .filter(p => p && p.trim() !== "")
        .join(" "),

    })
    .eq("id", id);

  // borrar líneas antiguas
  await supabaseAdmin.from("factura_lineas").delete().eq("factura_id", id);

  // insertar nuevas
  const nuevas = lineas.map(l => ({
    factura_id: id,
    concepto: l.concepto,
    precio: l.precio,
    cantidad: l.cantidad
  }));

  await supabaseAdmin.from("factura_lineas").insert(nuevas);

  return NextResponse.json({ ok: true });
}