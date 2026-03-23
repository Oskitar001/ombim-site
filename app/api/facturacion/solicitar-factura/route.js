import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { enviarEmail } from "@/lib/email";

export async function POST(req) {
  const supabase = await supabaseServer();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData?.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const body = await req.json();
  const { pago_id } = body;

  if (!pago_id) {
    return NextResponse.json({ error: "Falta pago_id" }, { status: 400 });
  }

  // Obtener el pago y verificar que pertenece al usuario
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

  // Obtener datos de facturación del usuario
  const { data: facturacion } = await supabase
    .from("facturacion")
    .select("*")
    .eq("user_id", userData.user.id)
    .single();

  if (!facturacion) {
    return NextResponse.json(
      { error: "Debes completar tus datos de facturación antes de solicitar factura" },
      { status: 400 }
    );
  }

  // Enviar email al administrador
  const html = `
    <div style="font-family: Arial; padding: 20px;">
      <h2>Solicitud de factura</h2>

      <p>El usuario <strong>${userData.user.email}</strong> ha solicitado una factura.</p>

      <h3>Datos del pago</h3>
      <p><strong>ID:</strong> ${pago.id}</p>
      <p><strong>Plugin:</strong> ${pago.plugin_id}</p>
      <p><strong>Importe:</strong> ${pago.importe} €</p>

      <h3>Datos de facturación</h3>
      <p><strong>Nombre:</strong> ${facturacion.nombre}</p>
      <p><strong>NIF:</strong> ${facturacion.nif}</p>
      <p><strong>Dirección:</strong> ${facturacion.direccion}</p>
      <p><strong>Ciudad:</strong> ${facturacion.ciudad}</p>
      <p><strong>CP:</strong> ${facturacion.cp}</p>
      <p><strong>País:</strong> ${facturacion.pais}</p>
      <p><strong>Teléfono:</strong> ${facturacion.telefono}</p>

      <p style="margin-top:20px;">
        <a href="https://tudominio.com/admin/pagos/${pago.id}"
           style="display:inline-block;padding:10px 15px;background:#2563eb;color:white;text-decoration:none;border-radius:5px;">
          Abrir pago en el panel admin
        </a>
      </p>
    </div>
  `;

  await enviarEmail(
    process.env.ADMIN_EMAIL,
    "Solicitud de factura",
    html
  );

  return NextResponse.json({ ok: true });
}
