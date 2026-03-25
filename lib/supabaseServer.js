// lib/supabaseServer.js — Next.js 16 compatible
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function supabaseServer() {
  const cookieStore = await cookies(); // 🔥 AQUÍ ESTÁ LA CLAVE: AWAIT

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set() {
          // No se permite escribir cookies desde SSR
        },
        remove() {
          // No se permite borrar cookies desde SSR
        },
      },
    }
  );
}