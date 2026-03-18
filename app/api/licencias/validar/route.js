import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req) {
  try {
    const { email_tekla, plugin_id, hardware_id } = await req.json();

    if (!email_tekla || !plugin_id || !hardware_id) {
      return NextResponse.json({ ok: false, error: "Datos incompletos" });
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );

    // Buscar licencia activa
    const { data: licencia } = await supabase
      .from("licencias")
      .select("*")
      .eq("email_tekla", email_tekla)
      .eq("plugin_id", plugin_id)
      .eq("estado", "activa")
      .single();

    if (!licencia) {
      return NextResponse.json({ ok: false, error: "Licencia no encontrada" });
    }

    // Comprobar expiración
    if (licencia.fecha_expiracion && new Date(licencia.fecha_expiracion) < new Date()) {
      return NextResponse.json({ ok: false, error: "Licencia expirada" });
    }

    // Comprobar activaciones existentes
    const { data: activaciones } = await supabase
      .from("licencia_activaciones")
      .select("*")
      .eq("licencia_id", licencia.id);

    // Si ya está activado en este hardware → OK
    if (activaciones.some(a => a.hardware_id === hardware_id)) {
      return NextResponse.json({ ok: true, licencia });
    }

    // Si supera el límite → error
    if (activaciones.length >= licencia.max_activaciones) {
      return NextResponse.json({ ok: false, error: "Límite de activaciones alcanzado" });
    }

    // Registrar nueva activación
    await supabase.from("licencia_activaciones").insert({
      licencia_id: licencia.id,
      hardware_id
    });

    return NextResponse.json({ ok: true, licencia });

  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message });
  }
}
