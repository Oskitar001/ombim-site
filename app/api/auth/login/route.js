import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/auth-helpers-nextjs";

export async function POST(req) {
  const body = await req.json();
  const { email, password } = body;

  const response = NextResponse.json({ ok: true });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { cookies: response.cookies }
  );

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const user = data.user;

  response.cookies.set("sb-user-role", user.user_metadata.role || "user", {
    path: "/",
    httpOnly: false,
    sameSite: "lax",
  });

  return response;
}
