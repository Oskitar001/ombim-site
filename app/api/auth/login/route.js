import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/auth-helpers-nextjs";

export async function POST(req) {
  const { email, password } = await req.json();

  const response = NextResponse.json({ ok: true });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get: (name) => req.cookies.get(name)?.value,
        set: (name, value, options) =>
          response.cookies.set(name, value, {
            ...options,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
          }),
        remove: (name, options) =>
          response.cookies.set(name, "", {
            ...options,
            maxAge: 0,
            path: "/",
          }),
      },
    }
  );

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const role = data.user.user_metadata?.role ?? "user";

  response.cookies.set("sb-user-role", role, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return response;
}