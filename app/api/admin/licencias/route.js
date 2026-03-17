import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  // Obtener licencias
  const { data: licencias } = await supabase
    .from("claves_entregadas")
    .select(`
      id,
      clave,
      revocada,
      revocada_por_abuso,
      fecha_entrega,
      users ( email ),
      plugins ( nombre )
    `)
    .order("fecha_entrega", { ascending: false });

  // Obtener IPs únicas por clave
  for (const lic of licencias) {
    const { data: usos } = await supabase
      .from("licencias_uso")
      .select("ip")
      .eq("clave", lic.clave);

    lic.ips_unicas = new Set(usos.map(u => u.ip)).size;
  }

  return NextResponse.json(licencias);
}
