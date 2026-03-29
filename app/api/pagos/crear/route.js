// /app/api/pagos/crear/route.js
import { supabaseRoute } from "@/lib/supabaseRoute";

export async function POST(req) {
  const supabase = supabaseRoute();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: "no_autenticado" }, { status: 401 });
  }

  const body = await req.json();
  const { plugin_id, emails_tekla, tipo } = body;

  if (!plugin_id || !emails_tekla?.length || !tipo) {
    return Response.json({ error: "faltan_datos" }, { status: 400 });
  }

  // Obtener plugin y precios
  const { data: plugin } = await supabase
    .from("plugins")
    .select("precio, precio_anual, precio_completa")
    .eq("id", plugin_id)
    .single();

  if (!plugin) {
    return Response.json({ error: "plugin_no_encontrado" }, { status: 404 });
  }

  // Precio base según tipo
  let precioUnitario = 0;
  if (tipo === "anual") precioUnitario = plugin.precio_anual;
  if (tipo === "completa") precioUnitario = plugin.precio_completa;

  // Cálculo → opción A (sin IVA → IVA → total)
  const subtotal = precioUnitario * emails_tekla.length;
  const iva = subtotal * 0.21;
  const importe_total = subtotal + iva;

  // Crear pago
  const { data: pago, error: pagoError } = await supabase
    .from("pagos")
    .insert({
      user_id: user.id,
      plugin_id,
      cantidad_licencias: emails_tekla.length,
      estado: "pendiente",
      tipo,
      fecha: new Date(),
      importe: importe_total,
      importe_base: subtotal,
      iva
    })
    .select()
    .single();

  if (pagoError) {
    console.error("Error creando pago:", pagoError);
    return Response.json({ error: "error_creando_pago" }, { status: 500 });
  }

  // Asociar emails
  const emailsInsert = emails_tekla.map((e) => ({
    pago_id: pago.id,
    email_tekla: e.trim(),
  }));

  await supabase.from("pagos_emails").insert(emailsInsert);

  return Response.json({
    ok: true,
    pago_id: pago.id,
    subtotal,
    iva,
    total: importe_total
  });
}
