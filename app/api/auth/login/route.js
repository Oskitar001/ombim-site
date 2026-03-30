// /app/api/auth/login/route.js
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/auth-helpers-nextjs";

export async function POST(req) {
  const { email, password } = await req.json();

  const normalizedEmail = email?.trim()?.toLowerCase();
  const cookieHeader = req.headers.get("cookie") ?? "";

  // Siempre usamos ESTA respuesta para permitir que Supabase modifique cookies
  const response = NextResponse.json({ ok: true });

  // Supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        // ✔ FIX: permitir "=" en valores de cookie
        get(name) {
          const raw = cookieHeader
            .split("; ")
            .find((c) => c.startsWith(name + "="));

          if (!raw) return undefined;

          return raw.slice(name.length + 1);
        },

        set(name, value, options) {
          const cookie = `${name}=${value}; Path=/; SameSite=Lax${
            options?.maxAge ? `; Max-Age=${options.maxAge}` : ""
          }`;

          response.headers.append("Set-Cookie", cookie);
        },

        remove(name) {
          response.headers.append(
            "Set-Cookie",
            `${name}=; Path=/; Max-Age=0; SameSite=Lax`
          );
        }
      }
    }
  );

  const { data, error } = await supabase.auth.signInWithPassword({
    email: normalizedEmail,
    password
  });

  // ❗ FIX: devolver SIEMPRE usando el mismo response
  if (error) {
    response.body = JSON.stringify({ error: error.message });
    response.status = 400;
    return response;
  }

  const role = data.user.user_metadata?.role ?? "user";

  // Cookie adicional para middleware
  response.headers.append(
    "Set-Cookie",
    `sb-user-role=${role}; Path=/; SameSite=Lax`
  );

  return response;
}