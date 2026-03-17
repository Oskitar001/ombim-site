import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req) {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

  const session = req.const cookieStore = await cookies(); cookieStore.get()("session")?.value;
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const user = JSON.parse(session);

  const plugin_id = req.nextUrl.searchParams.get("id");
  const plugin_nombre = req.nextUrl.searchParams.get("nombre");

  await supabase.from("descargas").insert({
    user_id: user.id,
    plugin_id,
    plugin_nombre,
    fecha: new Date().toISOString()
  });

  return NextResponse.json({ message: "Descarga registrada" });
}
