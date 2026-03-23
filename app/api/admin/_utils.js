import { cookies } from "next/headers";
import { createServerClient } from "@supabase/auth-helpers-nextjs";

export async function requireAdmin() {
  const cookieStore = await cookies(); // ← IMPORTANTE

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          const cookie = cookieStore.get(name);
          return cookie?.value;
        },
        set() {},
        remove() {}
      }
    }
  );

  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { error: "NO_AUTH", status: 401 };
  }

  if (user.user_metadata?.role !== "admin") {
    return { error: "NO_ADMIN", status: 403 };
  }

  return { supabase, user };
}
