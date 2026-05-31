import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("facturas")
    .select(`
      cliente_nombre,
      cliente_nif,
      cliente_direccion,
      cliente_ciudad,
      cliente_cp,
      cliente_telefono
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return NextResponse.json({ clientes: [] });
  }

  const clientesUnicos = [];

  (data || []).forEach((c) => {
    if (
      c.cliente_nombre &&
      !clientesUnicos.find((x) => x.nombre === c.cliente_nombre)
    ) {
      clientesUnicos.push({
        id: c.cliente_nombre,
        nombre: c.cliente_nombre,
        nif: c.cliente_nif,
        direccion: c.cliente_direccion,
        ciudad: c.cliente_ciudad,
        cp: c.cliente_cp,
        telefono: c.cliente_telefono,
      });
    }
  });

  return NextResponse.json({ clientes: clientesUnicos });
}