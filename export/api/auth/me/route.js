import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/auth-helpers-nextjs";

export async function GET(req) {
  const cookieHeader = req.headers.get("cookie") ?? "";
  
  // Creamos un array temporal para acumular cookies
  const cookieStore = [];

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          const raw = cookieHeader
            .split("; ")
            .find((c) => c.startsWith(name + "="));
          return raw ? raw.slice(name.length + 1) : undefined;
        },

        // Guardamos cookies, NO las enviamos aún
        set(name, value, options) {
          let cookie = `${name}=${value}; Path=/; SameSite=Lax`;
          if (options?.maxAge) cookie += `; Max-Age=${options.maxAge}`;
          cookieStore.push(cookie);
        },

        remove(name) {
          cookieStore.push(
            `${name}=; Path=/; Max-Age=0; SameSite=Lax`
          );
        }
      },
    }
  );

  const { data, error } = await supabase.auth.getUser();

  // Creamos la respuesta FINAL desde cero
  let res;

  if (error || !data?.user) {
    res = NextResponse.json({ user: null });
  } else {
    res = NextResponse.json({
      user: data.user,
      role: data.user.user_metadata?.role ?? "user",
    });
  }

  // Ahora sí: agregamos todas las cookies *acumuladas*
  cookieStore.forEach((c) => {
    res.headers.append("Set-Cookie", c);
  });

  return res;
}