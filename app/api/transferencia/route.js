import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { Resend } from "resend";

function generarClave() {
  return (
    Math.random().toString(36).substring(2, 8).toUpperCase() +
    "-" +
    Math.random().toString(36).substring(2, 8).toUpperCase()
  );
}

export async function POST(req) {
  console.log("📩 /api/transferencia llamado");

  let body = {};
  try {
    body = await req.json();
  } catch (e) {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const { plugin_id, tipo_id, licencias } = body;

  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");

    if (!sessionCookie) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const user = JSON.parse(sessionCookie.value);

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );

    // Obtener plugin
    const { data: plugin, error: pluginError } = await supabase
      .from("plugins")
      .select("*")
      .eq("id", plugin_id)
      .single();

    if (pluginError || !plugin) {
      return NextResponse.json({ error: "Plugin no encontrado" }, { status: 404 });
    }

    // Registrar pago
    const total = Number(plugin.precio) * licencias.length;

    const { data: pago, error: pagoError } = await supabase
      .from("pagos")
      .insert({
        user_id: user.id,
        plugin_id,
        email_tekla: null,
        estado: "pendiente",
        cantidad: total,
        metodo: "transferencia",
        referencia: null
      })
      .select()
      .single();

    if (pagoError) {
      return NextResponse.json({ error: pagoError.message }, { status: 500 });
    }

    // Registrar licencias (pendientes) con clave
    for (const lic of licencias) {
      const { error: licError } = await supabase.from("licencias").insert({
        email_tekla: lic.email_tekla,
        plugin_id,
        tipo_id,
        estado: "pendiente",
        max_activaciones: 3,
        activaciones_usadas: 0,
        clave: generarClave(),
        notas: `Pago pendiente ID: ${pago.id}`
      });

      if (licError) {
        console.log("❌ Error creando licencia:", licError);
      }
    }

    // Email de aviso al admin
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: `"OMBIM" <notificaciones@updates.ombim.com>`,
      to: "o.martinez@ombim.com",
      subject: `Nuevo pedido — ${plugin.nombre}`,
      html: `
        <h2>Nuevo pedido de licencias</h2>
        <p><strong>Usuario:</strong> ${user.email}</p>
        <p><strong>Plugin:</strong> ${plugin.nombre}</p>
        <p><strong>Cantidad de licencias:</strong> ${licencias.length}</p>
        <h3>Emails Tekla:</h3>
        <ul>
          ${licencias.map(l => `<li>${l.email_tekla}</li>`).join("")}
        </ul>
        <p><strong>Importe total:</strong> ${total} €</p>
        <p>Recuerda revisar la transferencia y aprobar el pago en el panel de administración.</p>
      `
    });

    return NextResponse.json({ ok: true });

  } catch (err) {
    console.log("❌ ERROR EN /api/transferencia:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
