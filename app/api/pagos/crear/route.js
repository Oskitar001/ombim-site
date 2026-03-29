// /app/api/pagos/crear/route.js
import { supabaseRoute } from "@/lib/supabaseRoute";

export async function POST(req) {
  const supabase = supabaseRoute();

  // 1. Usuario autenticado
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "no_autenticado" }, { status: 401 });
  }

  const body = await req.json();
  const { plugin_id, emails_tekla, tipo } = body;

  // 2. Validación básica
  if (!plugin_id || !emails_tekla?.length || !tipo) {
    return Response.json({ error: "faltan_datos" }, { status: 400 });
  }

  // 3. Validar tipo permitido (sin "normal")
  if (!["anual", "completa"].includes(tipo)) {
    return Response.json({ error: "tipo_invalido" }, { status: 400 });
  }

  // 4. Comprobar duplicados email + plugin
  const { data: existentes } = await supabase
    .from("licencias")
    .select("email_tekla")
    .eq("plugin_id", plugin_id)
    .in("email_tekla", emails_tekla)
    .neq("estado", "bloqueada");

  if (existentes?.length > 0) {
    return Response.json(
      {
        error: "ya_existe_licencia",
        emails: existentes.map((x) => x.email_tekla),
      },
      { status: 400 }
    );
  }

  // 5. Obtener plugin y precios
  const { data: plugin, error: pluginError } = await supabase
    .from("plugins")
    .select("precio, precio_anual, precio_completa")
    .eq("id", plugin_id)
    .single();

  if (pluginError || !plugin) {
    return Response.json({ error: "plugin_no_encontrado" }, { status: 404 });
  }

  // 6. Calcular precio por tipo
  let precioUnitario = 0;

  if (tipo === "anual") {
    precioUnitario = Number(plugin.precio_anual) || 0;
  }

  if (tipo === "completa") {
    precioUnitario = Number(plugin.precio_completa) || Number(plugin.precio) || 0;
  }

  const importe = precioUnitario * emails_tekla.length;

  // 7. Crear pago
  const { data: pago, error: pagoError } = await supabase
    .from("pagos")
    .insert({
      user_id: user.id,
      plugin_id,
      cantidad_licencias: emails_tekla.length,
      estado: "pendiente",
      tipo, // "anual" o "completa"
      fecha: new Date(),
      importe,
    })
    .select()
    .single();

  if (pagoError) {
    console.error("❌ Error creando pago:", pagoError);
    return Response.json({ error: "error_creando_pago" }, { status: 500 });
  }

  return Response.json({
    ok: true,
    pago_id: pago.id,
    importe,
  });
}