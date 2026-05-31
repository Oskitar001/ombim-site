import { generarNumeroFactura } from "@/lib/generarNumeroFactura";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { id } = await req.json();

    // 1️⃣ FACTURA ORIGINAL
    const { data: factura, error: facturaErr } = await supabaseAdmin
      .from("facturas")
      .select("*")
      .eq("id", id)
      .single();

    if (facturaErr || !factura) {
      console.error("Factura original no encontrada", facturaErr);
      return NextResponse.json({ error: "factura_no_encontrada" }, { status: 404 });
    }

    // 2️⃣ LINEAS
    const { data: lineas, error: lineasErr } = await supabaseAdmin
      .from("factura_lineas")
      .select("*")
      .eq("factura_id", id);

    if (lineasErr) {
      console.error("Error cargando líneas", lineasErr);
      return NextResponse.json({ error: "error_lineas" }, { status: 500 });
    }

    // 3️⃣ NUEVO NUMERO
    const numeroFactura = await generarNumeroFactura();

    // 4️⃣ CREAR FACTURA NUEVA
    const { data: nuevaFactura, error: nuevaErr } = await supabaseAdmin
      .from("facturas")
      .insert([
        {
          numero: numeroFactura,
          fecha: new Date(),
          cliente_nombre: factura.cliente_nombre,
          cliente_nif: factura.cliente_nif,
          cliente_direccion: factura.cliente_direccion,
          cliente_ciudad: factura.cliente_ciudad,
          cliente_cp: factura.cliente_cp,
          cliente_telefono: factura.cliente_telefono,
          subtotal: factura.subtotal,
          iva: factura.iva,
          retencion: factura.retencion,
          total: factura.total,
          pedidos: factura.pedidos, // ✅ IMPORTANTE
        },
      ])
      .select()
      .single();

    if (nuevaErr || !nuevaFactura) {
      console.error("Error creando factura nueva", nuevaErr);
      return NextResponse.json({ error: "error_crear_factura" }, { status: 500 });
    }

    // 5️⃣ DUPLICAR LINEAS
    const nuevasLineas = (lineas || []).map((l) => ({
      factura_id: nuevaFactura.id,
      concepto: l.concepto,
      precio: l.precio,
      cantidad: l.cantidad,
      importe: l.importe,
    }));

    const { error: insertLinesErr } = await supabaseAdmin
      .from("factura_lineas")
      .insert(nuevasLineas);

    if (insertLinesErr) {
      console.error("Error insertando líneas", insertLinesErr);
      return NextResponse.json({ error: "error_lineas_insert" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("ERROR DUPLICAR:", err);
    return NextResponse.json({ error: "error_interno" }, { status: 500 });
  }
}