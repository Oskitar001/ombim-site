import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

export async function POST(_req, { params }) {
  const pagoId = params.id;

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  // Obtener pago
  const { data: pago, error: pagoError } = await supabase
    .from("pagos")
    .select("*")
    .eq("id", pagoId)
    .single();

  if (pagoError || !pago) {
    return NextResponse.json({ error: "Pago no encontrado" }, { status: 404 });
  }

  // Obtener usuario
  const { data: user, error: userError } = await supabase
    .from("auth.users")
    .select("email")
    .eq("id", pago.user_id)
    .single();

  if (userError || !user) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }

  // Obtener plugin
  const { data: plugin, error: pluginError } = await supabase
    .from("plugins")
    .select("*")
    .eq("id", pago.plugin_id)
    .single();

  if (pluginError || !plugin) {
    return NextResponse.json({ error: "Plugin no encontrado" }, { status: 404 });
  }

  // Obtener licencias asociadas a este pago
  const { data: licencias, error: licError } = await supabase
    .from("licencias")
    .select("*")
    .like("notas", `%${pago.id}%`);

  if (licError) {
    return NextResponse.json({ error: licError.message }, { status: 500 });
  }

  // Activar licencias
  const { error: updateLicError } = await supabase
    .from("licencias")
    .update({ estado: "activa" })
    .like("notas", `%${pago.id}%`);

  if (updateLicError) {
    return NextResponse.json({ error: updateLicError.message }, { status: 500 });
  }

  // Marcar pago como aprobado
  const { error: updatePagoError } = await supabase
    .from("pagos")
    .update({ estado: "aprobado" })
    .eq("id", pagoId);

  if (updatePagoError) {
    return NextResponse.json({ error: updatePagoError.message }, { status: 500 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  // Email al cliente con claves
  await resend.emails.send({
    from: `"OMBIM" <notificaciones@updates.ombim.com>`,
    to: user.email,
    subject: `Tus licencias de ${plugin.nombre} han sido activadas`,
    html: `
      <h2>¡Pago aprobado!</h2>
      <p>Gracias por tu compra. Tus licencias ya están activas.</p>

      <h3>Detalles del pedido</h3>
      <p><strong>Plugin:</strong> ${plugin.nombre}</p>
      <p><strong>Cantidad de licencias:</strong> ${licencias.length}</p>

      <h3>Licencias activadas</h3>
      <ul>
        ${licencias
          .map(
            (l) =>
              `<li>${l.email_tekla} — Clave: <strong>${l.clave}</strong></li>`
          )
          .join("")}
      </ul>

      <p>Usa estas claves en tu sistema de activación.</p>
      <p>Si necesitas ayuda, contáctanos en soporte@ombim.com</p>
    `
  });

  // Email al admin
  await resend.emails.send({
    from: `"OMBIM" <notificaciones@updates.ombim.com>`,
    to: "o.martinez@ombim.com",
    subject: `Pago aprobado — ${plugin.nombre}`,
    html: `
      <h2>Pago aprobado</h2>
      <p>Se ha aprobado el pago ${pago.id}.</p>

      <h3>Licencias activadas:</h3>
      <ul>
        ${licencias
          .map(
            (l) =>
              `<li>${l.email_tekla} — Clave: <strong>${l.clave}</strong></li>`
          )
          .join("")}
      </ul>
    `
  });

  return NextResponse.json({ ok: true });
}
