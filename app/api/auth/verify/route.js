import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Token inválido" }, { status: 400 });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  // Buscar usuario con ese token
  const { data: users } = await supabase
    .from("users")
    .select("*")
    .eq("token_verificacion", token)
    .limit(1);

  if (!users || users.length === 0) {
    return NextResponse.json({ error: "Token no válido" }, { status: 400 });
  }

  const user = users[0];

  // Marcar como verificado
  await supabase
    .from("users")
    .update({
      verificado: true,
      token_verificacion: null
    })
    .eq("id", user.id);

  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/login?verified=1`);
}
