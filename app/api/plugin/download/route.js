// /app/api/plugin/download/route.js
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req) {
    const supabase = await supabaseServer();

    // Usuario logueado
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
        return NextResponse.json({ error: "no_autenticado" }, { status: 401 });
    }

    const user_id = userData.user.id;

    // plugin_id
    const plugin_id = new URL(req.url).searchParams.get("plugin_id");
    if (!plugin_id) {
        return NextResponse.json({ error: "falta_plugin_id" }, { status: 400 });
    }

    // Plugin
    const { data: plugin } = await supabaseAdmin
        .from("plugins")
        .select("archivo_url, precio")
        .eq("id", plugin_id)
        .single();

    if (!plugin) {
        return NextResponse.json({ error: "plugin_no_encontrado" }, { status: 404 });
    }

    // Licencia FULL
    const { data: lic } = await supabaseAdmin
        .from("licencias")
        .select("*")
        .eq("user_id", user_id)
        .eq("plugin_id", plugin_id)
        .eq("estado", "activa")
        .maybeSingle();

    let trial = true;

    if (lic) {
        if (lic.tipo === "completa") trial = false;
        if (lic.tipo === "anual" && lic.fecha_expiracion) {
            if (new Date(lic.fecha_expiracion) > new Date()) trial = false;
        }
    }

    // Rutas en bucket
    const filePath = trial
        ? `trial/${plugin_id}.tsep`
        : plugin.archivo_url;

    // Firmar URL
    const { data: signed } = await supabaseAdmin.storage
        .from("plugins")
        .createSignedUrl(filePath, 60);

    if (!signed?.signedUrl) {
        return NextResponse.json({ error: "no_se_puede_firmar" }, { status: 500 });
    }

    // Registrar descarga
    await supabase.from("descargas").insert({
        user_id,
        plugin_id,
        fecha: new Date().toISOString()
    });

    // JSON o redirección
    const wantsJSON = req.headers.get("accept")?.includes("application/json");
    if (wantsJSON) {
        return NextResponse.json({
            ok: true,
            trial,
            url: signed.signedUrl
        });
    }

    return NextResponse.redirect(signed.signedUrl);
}