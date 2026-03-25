import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { sendEmail } from "@/lib/email";

export async function POST(req) {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { nombre, direccion, cif, pedidoId } = await req.json();

  const html = `
    <h2>Solicitud de factura</h2>
    <p><strong>Usuario:</strong> ${user.email}</p>
    <p><strong>Nombre:</strong> ${nombre}</p>
    <p><strong>Dirección:</strong> ${direccion}</p>
    <p><strong>CIF:</strong> ${cif}</p>
    <p><strong>Pedido ID:</strong> ${pedidoId}</p>
  `;

  await sendEmail({
    to: "facturacion@ombim.site",
    subject: "Nueva solicitud de factura",
    html,
  });

  return NextResponse.json({ ok: true });
}