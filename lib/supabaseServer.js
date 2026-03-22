import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function supabaseServer() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SECRET_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          cookieStore.set(name, value, {
            ...options,
            secure: process.env.NODE_ENV === "production",
          });
        },
        remove(name, options) {
          cookieStore.set(name, "", {
            ...options,
            maxAge: 0,
            secure: process.env.NODE_ENV === "production",
          });
        },
      },
    }
  );
}
