import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

export async function checkAdmin() {
  try {
    const cookieStore = await cookies();

    // Buscar token en todas las variantes posibles
    const token =
      cookieStore.get("sb-access-token")?.value ||
      cookieStore.get("sb:token")?.value ||
      cookieStore.get("sb:access-token")?.value ||
      cookieStore.get("supabase-auth-token")?.value;

    if (!token) return false;

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SECRET_KEY,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    );

    const { data, error } = await supabase.auth.getUser();

    if (error || !data?.user) return false;

    const user = data.user;

    // Validar rol admin
    return user.user_metadata?.role === "admin";
  } catch (err) {
    console.error("Error en checkAdmin:", err);
    return false;
  }
}
