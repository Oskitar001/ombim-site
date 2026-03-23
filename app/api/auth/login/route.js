import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/auth-helpers-nextjs";

export async function POST(req) {
  const { email, password } = await req.json();

  // Creamos la respuesta JSON donde se escribirán las cookies
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
            path: "/",
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
          }),
        remove: (name, options) =>
          response.cookies.set(name, "", {
            ...options,
            path: "/",
            maxAge: 0,
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

  // Guardamos el rol para el proxy
  const role = data.user.user_metadata.role || "user";

  response.cookies.set("sb-user-role", role, {
    path: "/",
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  // DEVOLVEMOS EL USUARIO Y EL ROL
  return NextResponse.json(
    {
      ok: true,
      user: data.user,
      role,
    },
    {
      headers: response.headers,
    }
  );
}
