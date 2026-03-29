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

  // 3. Validar tipo permitido
  if (!["anual", "completa"].includes(tipo)) {
    return Response.json({ error: "tipo_invalido" }, { status: 400 });
  }

  // 4. No permitir compras duplicadas: plugin + email Tekla
  const { data: pagosPrevios } = await supabase
    .from("pagos_emails")
    .select(`
      pago_id,
      email_tekla,
      pagos!inner (
        id,
        plugin_id,
        estado
      )
    `)
    .in("email_tekla", emails_tekla)
    .eq("pagos.plugin_id", plugin_id)
    .in("pagos.estado", ["pendiente", "aprobado"]);

  if (pagosPrevios?.length > 0) {
    return Response.json(
      {
        error: "ya_existe_pago",
        mensaje:
          "Ya existe un pago activo para este plugin con este email Tekla. Si ya realizaste la transferencia, usa el botón 'He realizado la transferencia'.",
        pago_existente: pagosPrevios[0].pago_id,
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

  // 6. Calcular precio
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
      tipo,
      fecha: new Date(),
      importe,
    })
    .select()
    .single();

  if (pagoError) {
    console.error("❌ Error creando pago:", pagoError);
    return Response.json({ error: "error_creando_pago" }, { status: 500 });
  }

  // 8. Insertar emails tekla asociados
  const emailsInsert = emails_tekla.map((e) => ({
    pago_id: pago.id,
    email_tekla: e
  }));

  await supabase.from("pagos_emails").insert(emailsInsert);

  return Response.json({
    ok: true,
    pago_id: pago.id,
    importe,
  });
}