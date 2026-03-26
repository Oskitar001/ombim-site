// app/api/admin/plugins/notificar-version/route.js
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/checkAdmin";
import { sendEmail } from "@/lib/email"; 

export async function POST(req) {
  const admin = await requireAdmin();
  if (!admin.ok) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const { plugin_id, archivo_nombre } = await req.json();

  if (!plugin_id || !archivo_nombre) {
    return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
  }

  // 1. Obtener el nombre del plugin
  const { data: plugin } = await supabaseAdmin
    .from("plugins")
    .select("nombre")
    .eq("id", plugin_id)
    .single();

  if (!plugin) {
    return NextResponse.json({ error: "Plugin no encontrado" }, { status: 404 });
  }

  // 2. Obtener compradores validados
  const { data: pagos } = await supabaseAdmin
    .from("pagos")
    .select("user_id")
    .eq("plugin_id", plugin_id)
    .eq("estado", "validado");

  if (!pagos?.length) {
    return NextResponse.json({ ok: true, enviados: 0 });
  }

  const compradoresIds = pagos.map(p => p.user_id);

  // 3. Listar usuarios
  const { data: usuarios } = await supabaseAdmin.auth.admin.listUsers();

  const compradores = usuarios.users.filter(u => compradoresIds.includes(u.id));

  // 4. Mandar email a cada comprador
  for (const user of compradores) {
    const html = `
      <h2>Actualización disponible</h2>
      <p>El plugin <strong>${plugin.nombre}</strong> tiene una nueva versión:</p>
      <p><strong>${archivo_nombre}</strong></p>
      <p>Ya puedes descargarla desde tu panel de usuario.</p>
      <p>Saludos,<br/>OMBIM</p>
    `;

    await sendEmail({
      to: user.email,
      subject: `Nueva versión del plugin ${plugin.nombre}`,
      html,
    });
  }

  return NextResponse.json({ ok: true, enviados: compradores.length });
}