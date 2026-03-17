import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req) {
  const { plugin_id, clave } = await req.json();

  if (!plugin_id || !clave) {
    return NextResponse.json(
      { valida: false, motivo: "Datos incompletos" },
      { status: 400 }
    );
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  // Buscar clave
  const { data: registro } = await supabase
    .from("claves_entregadas")
    .select(`
      clave,
      plugin_id,
      user_id,
      revocada,
      revocada_por_abuso,
      users ( email )
    `)
    .eq("clave", clave)
    .single();

  if (!registro) {
    return NextResponse.json({
      valida: false,
      motivo: "Clave no válida"
    });
  }

  if (registro.plugin_id !== plugin_id) {
    return NextResponse.json({
      valida: false,
      motivo: "La clave no pertenece a este plugin"
    });
  }

  if (registro.revocada) {
    return NextResponse.json({
      valida: false,
      motivo: registro.revocada_por_abuso
        ? "Clave revocada automáticamente por abuso"
        : "Clave revocada"
    });
  }

  // Registrar uso
  const ip = req.headers.get("x-forwarded-for") || "desconocida";
  const userAgent = req.headers.get("user-agent") || "desconocido";

  await supabase.from("licencias_uso").insert({
    clave,
    ip,
    user_agent: userAgent
  });

  // DETECCIÓN DE ABUSO: contar IPs distintas en las últimas 24h
  const { data: usos } = await supabase
    .from("licencias_uso")
    .select("ip")
    .eq("clave", clave)
    .gte("fecha", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

  const ipsUnicas = new Set(usos.map(u => u.ip));

  if (ipsUnicas.size > 3) {
    // Revocar automáticamente por abuso
    await supabase
      .from("claves_entregadas")
      .update({
        revocada: true,
        revocada_por_abuso: true
      })
      .eq("clave", clave);

    return NextResponse.json({
      valida: false,
      motivo: "Clave revocada automáticamente por uso sospechoso"
    });
  }

  return NextResponse.json({
    valida: true,
    usuario: registro.users.email
  });
}
