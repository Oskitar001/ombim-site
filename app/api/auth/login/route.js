import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/auth-helpers-nextjs";

export async function POST(req) {
  const { email, password } = await req.json();
  const cookieHeader = req.headers.get("cookie") ?? "";
  const response = NextResponse.json({ ok: true });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          const match = cookieHeader
            .split("; ")
            .find((c) => c.startsWith(name + "="));
          return match ? match.split("=")[1] : undefined;
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
        },
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

  // Cookie para middleware
  response.headers.append(
    "Set-Cookie",
    `sb-user-role=${role}; Path=/; SameSite=Lax`
  );

  return response;
}