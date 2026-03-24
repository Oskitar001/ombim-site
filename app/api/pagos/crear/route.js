// app/api/pagos/crear/route.js
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req) {
  const supabase = await supabaseServer();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const body = await req.json();
  const { plugin_id, licencias } = body;

  if (!plugin_id || !licencias?.length) {
    return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
  }

  const cantidad = licencias.length;

  const { data: plugin } = await supabase
    .from("plugins")
    .select("id, precio")
    .eq("id", plugin_id)
    .single();

  if (!plugin) {
    return NextResponse.json({ error: "Plugin no encontrado" }, { status: 400 });
  }

  // Crear pago
  const { data: pago, error: pagoError } = await supabase
    .from("pagos")
    .insert({
      user_id: userData.user.id,
      plugin_id,
      cantidad_licencias: cantidad,
      estado: "pendiente",
      importe: plugin.precio * cantidad,
    })
    .select("id")
    .single();

  if (pagoError) {
    return NextResponse.json({ error: pagoError.message }, { status: 500 });
  }

  // Crear licencias asociadas
  const licenciaRows = licencias.map((l) => ({
    pago_id: pago.id,
    plugin_id,
    user_id: userData.user.id,
    email_tekla: l.email_tekla ?? "",
    estado: "trial",
  }));

  const { error: licError } = await supabase.from("licencias").insert(licenciaRows);

  if (licError) {
    return NextResponse.json({ error: licError.message }, { status: 500 });
  }

  return NextResponse.json({ pago_id: pago.id });
}