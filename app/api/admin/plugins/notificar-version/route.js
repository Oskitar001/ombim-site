// app/api/admin/plugins/notificar-version/route.js
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/checkAdmin";
import { sendEmail } from "@/lib/email";

export const runtime = "nodejs"; // ✔ necesario en Next 16

export async function POST(req) {
  // 🔐 Verificar admin
  const admin = await requireAdmin();
  if (!admin.ok) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  // Leer body
  const { plugin_id, archivo_nombre } = await req.json();

  if (!plugin_id || !archivo_nombre) {
    return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
  }

  // 1. Obtener plugin
  const { data: plugin, error: errPlugin } = await supabaseAdmin
    .from("plugins")
    .select("nombre")
    .eq("id", plugin_id)
    .single();

  if (errPlugin || !plugin) {
    return NextResponse.json(
      { error: "Plugin no encontrado" },
      { status: 404 }
    );
  }

  // 2. Obtener compradores validados
  const { data: pagos, error: errPagos } = await supabaseAdmin
    .from("pagos")
    .select("user_id")
    .eq("plugin_id", plugin_id)
    .eq("estado", "validado");

  if (errPagos) {
    return NextResponse.json(
      { error: "Error obteniendo compradores" },
      { status: 500 }
    );
  }

  if (!pagos?.length) {
    return NextResponse.json({ ok: true, enviados: 0 });
  }

  const compradoresIds = pagos.map((p) => p.user_id);

  // 3. Listar usuarios
  const { data: usersData, error: errUsers } =
    await supabaseAdmin.auth.admin.listUsers();

  if (errUsers) {
    return NextResponse.json(
      { error: "Error listando usuarios" },
      { status: 500 }
    );
  }

  // 🔥 FIX: antes usuarios.users era undefined
  const usuarios = usersData?.users ?? [];

  // Filtrar compradores reales
  const compradores = usuarios.filter((u) =>
    compradoresIds.includes(u.id)
  );

  // 4. Mandar correos
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

  return NextResponse.json({
    ok: true,
    enviados: compradores.length
  });
}