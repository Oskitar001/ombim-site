import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req) {
  const supabase = await supabaseServer();
  const { email, password } = await req.json();

  // 1. Login
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // 2. Obtener sesión actual (esto genera la cookie)
  const { data: sessionData } = await supabase.auth.getSession();

  // ⭐ Asegurar que el nombre viene en la respuesta
  const user = {
    ...data.user,
    nombre:
      data.user?.user_metadata?.nombre ||
      data.user?.user_metadata?.member ||
      null
  };

  // 3. Responder con la cookie incluida
  return NextResponse.json(
    { user, session: sessionData.session },
    { status: 200 }
  );
}
