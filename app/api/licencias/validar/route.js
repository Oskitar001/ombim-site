// /app/api/licencias/validar/route.js
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

export async function POST(req) {
    let payload;
    try {
        payload = await req.json();
    } catch {
        return NextResponse.json({ ok: false, error: "json_invalido" });
    }

    const { email_tekla, plugin_id } = payload;

    if (!email_tekla || !plugin_id) {
        return NextResponse.json({ ok: false, error: "faltan_datos" });
    }

    // 1. Buscar licencia existente
    const { data: lic, error } = await supabaseAdmin
        .from("licencias")
        .select("*")
        .eq("email_tekla", email_tekla)
        .eq("plugin_id", plugin_id)
        .single();

    if (error || !lic) {
        return NextResponse.json({ ok: false, error: "no_existe" });
    }

    // 2. Bloqueada
    if (lic.estado === "bloqueada") {
        return NextResponse.json({ ok: false, error: "bloqueada" });
    }

    // 3. Licencia anual expirada
    if (lic.tipo === "anual" && lic.fecha_expiracion) {
        const ahora = new Date();
        const expira = new Date(lic.fecha_expiracion);
        if (expira < ahora) {
            return NextResponse.json({ ok: false, error: "expirada" });
        }
    }

    // 4. Activaciones disponibles
    if (lic.activaciones_usadas >= lic.max_activaciones) {
        return NextResponse.json({ ok: false, error: "sin_activaciones" });
    }

    // 5. Incrementar activaciones
    const nuevas = lic.activaciones_usadas + 1;

    await supabaseAdmin
        .from("licencias")
        .update({
            activaciones_usadas: nuevas
        })
        .eq("id", lic.id);

    // 6. Respuesta para el plugin
    return NextResponse.json({
        ok: true,
        licencia: {
            estado: lic.estado,
            fecha_expiracion: lic.fecha_expiracion // null o fecha en anual
        }
    });
}