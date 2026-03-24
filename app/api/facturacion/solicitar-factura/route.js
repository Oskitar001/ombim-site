// app/api/facturacion/solicitar-factura/route.js
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { enviarEmail } from "@/lib/email";

export async function POST(req) {
  const supabase = await supabaseServer();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { pago_id } = await req.json();
  if (!pago_id) {
    return NextResponse.json({ error: "Falta pago_id" }, { status: 400 });
  }

  const { data: pago } = await supabase
    .from("pagos")
    .select("*, licencias(*)")
    .eq("id", pago_id)
    .eq("user_id", userData.user.id)
    .single();

  if (!pago) {
    return NextResponse.json(
      { error: "Pago no encontrado o no pertenece al usuario" },
      { status: 404 }
    );
  }

  const { data: facturacion } = await supabase
    .from("facturacion")
    .select("*")
    .eq("user_id", userData.user.id)
    .single();

  if (!facturacion) {
    return NextResponse.json(
      { error: "Debes completar tus datos de facturación" },
      { status: 400 }
    );
  }

  const html = `
  <h4>Solicitud de factura</h4>
  Usuario: ${userData.user.email}<br>
  Pago ID: ${pago.id}<br>
  Importe: ${pago.importe ?? "—"} €
  Nombre: ${facturacion.nombre}
  `;

  await enviarEmail(process.env.ADMIN_EMAIL, "Solicitud de factura", html);

  return NextResponse.json({ ok: true });
}