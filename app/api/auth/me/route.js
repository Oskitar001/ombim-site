import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/auth-helpers-nextjs";

export async function GET(req) {
  const response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get: (name) => req.cookies.get(name)?.value,
        set: (name, value, options) =>
          response.cookies.set(name, value, options),
        remove: (name, options) =>
          response.cookies.set(name, "", { ...options, maxAge: 0 }),
      },
    }
  );

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({
    user: data.user,
    role: data.user.user_metadata?.role || "user",
  });
}
