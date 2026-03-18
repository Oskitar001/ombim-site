export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { checkAdmin } from "@/lib/checkAdmin";

export async function POST(req) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const { id } = await req.json();

  const fecha = new Date();
  fecha.setDate(fecha.getDate() + 7);

  const { error } = await supabaseAdmin
    .from("licencias")
    .update({
      estado: "trial",
      fecha_expiracion: fecha.toISOString(),
    })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ message: "Trial activado" });
}
