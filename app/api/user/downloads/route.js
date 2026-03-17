export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;

  if (!sessionCookie) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const user = JSON.parse(sessionCookie);

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  // Plugins comprados
  const { data: pagos, error: pagosError } = await supabase
    .from("pagos")
    .select(`
      plugin_id,
      plugins (*)
    `)
    .eq("user_id", user.id)
    .eq("estado", "completado");

  // Plugins con licencia
  const { data: licencias, error: licenciasError } = await supabase
    .from("licencias")
    .select(`
      plugin_id,
      codigo,
      estado,
      plugins (*)
    `)
    .eq("user_id", user.id);

  if (pagosError || licenciasError) {
    return NextResponse.json(
      { error: pagosError?.message || licenciasError?.message },
      { status: 500 }
    );
  }

  // Unir resultados
  const descargas = [
    ...pagos.map((p) => ({
      tipo: "compra",
      plugin: p.plugins,
      licencia: null
    })),
    ...licencias.map((l) => ({
      tipo: "licencia",
      plugin: l.plugins,
      licencia: l.codigo
    }))
  ];

  return NextResponse.json(descargas);
}
