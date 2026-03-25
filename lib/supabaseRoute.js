import { cookies } from "next/headers";
import { createServerClient } from "@supabase/auth-helpers-nextjs";

export function supabaseRoute() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        async get(name) {
          const store = await cookies();      // FIX: cookies() es async en Next 16
          const cookie = store.get(name);
          return cookie?.value;
        },
        async set(name, value, options) {
          const store = await cookies();
          store.set(name, value, options);
        },
        async remove(name, options) {
          const store = await cookies();
          store.set(name, "", { ...options, maxAge: 0 });
        },
      },
    }
  );
}
