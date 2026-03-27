// /app/api/admin/pagos/validar/[id]/route.js
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

export async function POST(req, { params }) {
  const pago_id = params.id;

  if (!pago_id) {
    return Response.json({ error: "Falta pago_id" }, { status: 400 });
  }

  try {
    // =====================================================
    // 1. CARGAR EL PAGO
    // =====================================================
    const { data: pago, error: pagoError } = await supabaseAdmin
      .from("pagos")
      .select("*")
      .eq("id", pago_id)
      .single();

    if (pagoError || !pago) {
      return Response.json({ error: "Pago no encontrado" }, { status: 404 });
    }

    // =====================================================
    // 2. VALIDAR EMAILS TEKLA
    // =====================================================
    if (!Array.isArray(pago.emails_tekla) || pago.emails_tekla.length === 0) {
      return Response.json(
        { error: "Este pago no tiene emails Tekla asignados" },
        { status: 400 }
      );
    }

    // =====================================================
    // 3. VALIDAR QUE NO EXISTAN LICENCIAS DUPLICADAS
    // (No se puede comprar el mismo plugin dos veces para el mismo email)
    // =====================================================
    const { data: existentes, error: dupError } = await supabaseAdmin
      .from("licencias")
      .select("email_tekla")
      .in("email_tekla", pago.emails_tekla)
      .eq("plugin_id", pago.plugin_id);

    if (dupError) {
      return Response.json(
        { error: "Error verificando duplicados" },
        { status: 500 }
      );
    }

    if (existentes.length > 0) {
      const repetidos = existentes.map((l) => l.email_tekla);
      return Response.json(
        {
          error:
            "No se puede comprar el mismo plugin para estos emails (ya tienen licencia):",
          emails: repetidos,
        },
        { status: 400 }
      );
    }

    // =====================================================
    // 4. DETERMINAR CONFIGURACIÓN SEGÚN TIPO DE LICENCIA
    // =====================================================
    let max_activaciones = 1;
    let soporte_dias = 0;

    switch (pago.tipo_licencia) {
      case "anual":
        max_activaciones = 1;
        soporte_dias = pago.soporte_dias ?? 0; // viene desde la tabla licencias_tipos
        break;

      case "completa":
        max_activaciones = 5;
        soporte_dias = 0;
        break;

      default:
        return Response.json(
          { error: "Tipo de licencia desconocido" },
          { status: 400 }
        );
    }

    // =====================================================
    // 5. CREAR LAS LICENCIAS
    // =====================================================
    const ahora = new Date().toISOString();

    const licencias = pago.emails_tekla.map((email) => ({
      plugin_id: pago.plugin_id,
      email_tekla: email,
      estado: "activa",
      max_activaciones,
      activaciones_usadas: 0,
      soporte_dias,
      fecha_creacion: ahora,
      pago_id,
      user_id: pago.user_id,
    }));

    const { error: licError } = await supabaseAdmin
      .from("licencias")
      .insert(licencias);

    if (licError) {
      return Response.json(
        { error: "Error creando licencias", detalle: licError },
        { status: 500 }
      );
    }

    // =====================================================
    // 6. MARCAR EL PAGO COMO VALIDADO
    // =====================================================
    await supabaseAdmin
      .from("pagos")
      .update({ estado: "validado" })
      .eq("id", pago_id);

    // =====================================================
    // 7. ELIMINAR PAGOS DUPLICADOS
    // =====================================================
    await supabaseAdmin
      .from("pagos")
      .delete()
      .neq("id", pago_id)
      .eq("payment_uid", pago.payment_uid);

    // =====================================================
    // 8. OBTENER EMAIL REAL DEL USUARIO
    // =====================================================
    const { data: userData } =
      await supabaseAdmin.auth.admin.getUserById(pago.user_id);

    const userEmail = userData?.user?.email;

    // =====================================================
    // 9. ENVIAR EMAIL DE ACTIVACIÓN
    // =====================================================
    if (userEmail) {
      const siteURL = process.env.NEXT_PUBLIC_SITE_URL;

      await fetch(`${siteURL}/api/email/licencias/activadas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          emails_tekla: pago.emails_tekla,
          tipo_licencia: pago.tipo_licencia,
        }),
      });
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error("ERROR EN VALIDAR PAGO:", err);
    return Response.json({ error: "Error interno" }, { status: 500 });
  }
}