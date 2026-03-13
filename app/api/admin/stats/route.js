// app/api/admin/stats/route.js
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  const [usuariosRes, activosRes, suspendidosRes, dispositivosRes, logsRes] =
    await Promise.all([
      supabase.from("usuarios").select("id", { count: "exact", head: true }),
      supabase
        .from("usuarios")
        .select("id", { count: "exact", head: true })
        .eq("estado", "activo"),
      supabase
        .from("usuarios")
        .select("id", { count: "exact", head: true })
        .eq("estado", "suspendido"),
      supabase
        .from("dispositivos")
        .select("id", { count: "exact", head: true }),
      supabase.from("logs").select("id", { count: "exact", head: true })
    ]);

  return NextResponse.json({
    usuarios_totales: usuariosRes.count || 0,
    usuarios_activos: activosRes.count || 0,
    usuarios_suspendidos: suspendidosRes.count || 0,
    dispositivos_totales: dispositivosRes.count || 0,
    logs_totales: logsRes.count || 0
  });
}
