import { NextResponse } from "next/server";
import { cookies } from "next/headers";
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

  // 2. Obtener sesión
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData?.session?.access_token;

  if (!token) {
    return NextResponse.json({ error: "No session token" }, { status: 500 });
  }

  // 3. Crear cookie "session"
  const cookieStore = await cookies();
  cookieStore.set("session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/"
  });

  // 4. Preparar usuario
  const user = {
    ...data.user,
    nombre:
      data.user?.user_metadata?.nombre ||
      data.user?.user_metadata?.member ||
      null
  };

  return NextResponse.json(
    { user, session: sessionData.session },
    { status: 200 }
  );
}
