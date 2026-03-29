// /app/api/facturacion/solicitar/route.js
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { sendEmail } from "@/lib/email";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const supabase = await supabaseServer();

    // ========================================
    // 1. Verificar usuario autenticado
    // ========================================
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    // ========================================
    // 2. Validar que el usuario tiene facturación
    // ========================================
    const { data: fact } = await supabase
      .from("facturacion")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!fact) {
      return NextResponse.json(
        {
          error: "sin_datos_facturacion",
          mensaje:
            "Debes completar tu información de facturación antes de solicitar una factura.",
        },
        { status: 400 }
      );
    }

    // ========================================
    // 3. Leer el pago_id enviado por el usuario
    // ========================================
    const { pagoId } = await req.json();

    if (!pagoId) {
      return NextResponse.json(
        { error: "faltan_datos", mensaje: "Falta pagoId en la solicitud." },
        { status: 400 }
      );
    }

    // ========================================
    // 4. Comprobar que el pago existe y es suyo
    // ========================================
    const { data: pago } = await supabase
      .from("pagos")
      .select("id, user_id, factura_solicitada, numero_factura")
      .eq("id", pagoId)
      .maybeSingle();

    if (!pago) {
      return NextResponse.json(
        { error: "pago_no_encontrado" },
        { status: 404 }
      );
    }

    // Evitar que un usuario pida factura de otro usuario
    if (pago.user_id !== user.id) {
      return NextResponse.json(
        { error: "acceso_denegado" },
        { status: 403 }
      );
    }

    // Si ya tiene número → no solicitar
    if (pago.numero_factura) {
      return NextResponse.json({
        ok: true,
        mensaje: "Este pago ya tiene factura disponible.",
      });
    }

    // Si ya estaba solicitada → no duplicar
    if (pago.factura_solicitada) {
      return NextResponse.json({
        ok: true,
        mensaje: "La factura ya había sido solicitada.",
      });
    }

    // ========================================
    // 5. Marcar el pago como 'solicita factura'
    // ========================================
    await supabase
      .from("pagos")
      .update({ factura_solicitada: true })
      .eq("id", pagoId);

    // ========================================
    // 6. Enviar email al administrador
    // ========================================
    const html = `
      <h2>Solicitud de factura</h2>

      <h3>Usuario solicitante</h3>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Nombre:</strong> ${user.user_metadata?.nombre ?? "—"}</p>
      <p><strong>Empresa:</strong> ${user.user_metadata?.empresa ?? "—"}</p>

      <h3>Datos de facturación</h3>
      <p><strong>Razón social:</strong> ${fact.nombre}</p>
      <p><strong>NIF/CIF:</strong> ${fact.nif}</p>
      <p><strong>Dirección:</strong> ${fact.direccion}</p>
      <p><strong>Ciudad:</strong> ${fact.ciudad}</p>
      <p><strong>CP:</strong> ${fact.cp}</p>
      <p><strong>País:</strong> ${fact.pais}</p>
      <p><strong>Teléfono:</strong> ${fact.telefono}</p>

      <h3>Pago solicitado</h3>
      <p><strong>ID del pago:</strong> ${pagoId}</p>

      <p>Debe asignarse un número de factura para que el usuario pueda descargarla.</p>
    `;

    await sendEmail({
      to: "facturacion@ombim.site",
      subject: `[OMBIM] Nueva solicitud de factura`,
      html,
    });

    // ========================================
    // 7. Respuesta correcta al usuario
    // ========================================
    return NextResponse.json({
      ok: true,
      mensaje: "Solicitud enviada. El administrador la revisará.",
    });
  } catch (err) {
    console.error("❌ Error solicitando factura:", err);
    return NextResponse.json(
      { error: "error_interno", mensaje: err.message },
      { status: 500 }
    );
  }
}