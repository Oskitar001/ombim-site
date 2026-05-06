// /app/api/pagos/crear/route.js
import { supabaseRoute } from "@/lib/supabaseRoute";

export async function POST(req) {
  const supabase = await supabaseRoute();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "no_autenticado" }, { status: 401 });
  }

  const body = await req.json();

  const { plugin_id, cantidad, tipo } = body;

  if (!plugin_id || !cantidad || !tipo) {
    return Response.json({ error: "faltan_datos" }, { status: 400 });
  }

  // ✅ CAMBIO: ahora pedimos también permisos + precio trimestral
  const { data: plugin, error: pluginError } = await supabase
    .from("plugins")
    .select(`
      precio_anual,
      precio_completa,
      precio_trimestral,
      permite_anual,
      permite_completa,
      permite_trimestral
    `)
    .eq("id", plugin_id)
    .single();

  if (pluginError || !plugin) {
    return Response.json({ error: "plugin_no_encontrado" }, { status: 404 });
  }

  // ✅ VALIDACIÓN DE TIPO PERMITIDO
  if (
    (tipo === "anual" && !plugin.permite_anual) ||
    (tipo === "completa" && !plugin.permite_completa) ||
    (tipo === "trimestral" && !plugin.permite_trimestral)
  ) {
    return Response.json({ error: "tipo_no_permitido" }, { status: 400 });
  }

  // ✅ PRECIO DINÁMICO
  let precioUnitario = 0;

  if (tipo === "trimestral") {
    precioUnitario = Number(plugin.precio_trimestral) || 0;
  }

  if (tipo === "anual") {
    precioUnitario = Number(plugin.precio_anual) || 0;
  }

  if (tipo === "completa") {
    precioUnitario = Number(plugin.precio_completa) || 0;
  }

  const subtotal = precioUnitario * cantidad;
  const iva = subtotal * 0.21;
  const importe_total = subtotal + iva;

  // Crear pago
  const { data: pago, error: pagoError } = await supabase
    .from("pagos")
    .insert({
      user_id: user.id,
      plugin_id,
      cantidad_licencias: cantidad,
      estado: "pendiente",
      tipo,
      fecha: new Date(),
      importe: importe_total,
      importe_base: subtotal,
      iva,
    })
    .select()
    .single();

  if (pagoError) {
    console.error("Error creando pago:", pagoError);
    return Response.json({ error: "error_creando_pago" }, { status: 500 });
  }

  return Response.json({
    ok: true,
    pago_id: pago.id,
    subtotal,
    iva,
    total: importe_total,
  });
}