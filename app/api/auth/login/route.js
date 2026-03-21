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

  // 3. Responder con la cookie incluida
  return NextResponse.json(
    { user: data.user, session: sessionData.session },
    { status: 200 }
  );
}
