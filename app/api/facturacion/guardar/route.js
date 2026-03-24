// app/api/facturacion/guardar/route.js
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req) {
  const supabase = await supabaseServer();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const user_id = userData.user.id;
  const body = await req.json();

  const { error } = await supabase
    .from("facturacion")
    .upsert(
      { user_id, ...body, updated_at: new Date() },
      { onConflict: "user_id" }
    );

  if (error) {
    return NextResponse.json(
      { error: "Error guardando datos", detalle: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}