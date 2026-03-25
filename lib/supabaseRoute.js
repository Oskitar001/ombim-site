// lib/supabaseRoute.js
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export function supabaseRoute() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        async set(name, value, options) {
          cookieStore.set(name, value, options); // ✔ permitido aquí
        },
        async remove(name, options) {
          cookieStore.set(name, "", { ...options, maxAge: 0 }); // ✔ permitido aquí
        },
      },
    }
  );
}