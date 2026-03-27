import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/auth-helpers-nextjs";

export async function GET(req) {
  const cookieHeader = req.headers.get("cookie") ?? "";
  const response = NextResponse.json({});

  // Cliente Supabase compatible con Node 16 / Vercel
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

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({
    user: data.user,
    role: data.user.user_metadata?.role ?? "user",
  });
}