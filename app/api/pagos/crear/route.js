// /app/api/pagos/crear/route.js
import { supabaseRoute } from "@/lib/supabaseRoute";

export async function POST(req) {
    const supabase = supabaseRoute();

    // 1. Usuario autenticado
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return Response.json({ error: "no_autenticado" }, { status: 401 });
    }

    const body = await req.json();
    const { plugin_id, emails_tekla, tipo } = body;

    if (!plugin_id || !emails_tekla?.length || !tipo) {
        return Response.json({ error: "faltan_datos" }, { status: 400 });
    }

    // 2. Validar tipo válido
    if (!["anual", "completa"].includes(tipo)) {
        return Response.json({ error: "tipo_invalido" }, { status: 400 });
    }

    // 3. Comprobar duplicados de email+plugin
    const { data: existentes } = await supabase
        .from("licencias")
        .select("email_tekla")
        .eq("plugin_id", plugin_id)
        .in("email_tekla", emails_tekla)
        .neq("estado", "bloqueada");

    if (existentes?.length > 0) {
        return Response.json({
            error: "ya_existe_licencia",
            emails: existentes.map(x => x.email_tekla)
        }, { status: 400 });
    }

    // 4. Cargar plugin → precio
    const { data: plugin } = await supabase
        .from("plugins")
        .select("precio")
        .eq("id", plugin_id)
        .single();

    const importe = (plugin?.precio ?? 0) * emails_tekla.length;

    // 5. Crear pago
    const { data: pago, error: pagoError } = await supabase
        .from("pagos")
        .insert({
            user_id: user.id,
            plugin_id,
            cantidad_licencias: emails_tekla.length,
            estado: "pendiente",
            tipo,
            fecha: new Date(),
            importe
        })
        .select()
        .single();

    if (pagoError) {
        console.error(pagoError);
        return Response.json({ error: "error_creando_pago" }, { status: 500 });
    }

    return Response.json({
        ok: true,
        pago_id: pago.id,
        importe
    });
}