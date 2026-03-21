import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function supabaseServer() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          try {
            cookieStore.set(name, value, {
              ...options,
              secure: process.env.NODE_ENV === "production"
            });
          } catch {}
        },
        remove(name, options) {
          try {
            cookieStore.set(name, "", {
              ...options,
              maxAge: 0,
              secure: process.env.NODE_ENV === "production"
            });
          } catch {}
        }
      }
    }
  );
}
