import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

export async function checkAdmin() {
  const cookieStore = await cookies();

  // ESTA ES LA COOKIE CORRECTA
  const token = cookieStore.get("sb-access-token")?.value 
             || cookieStore.get("sb:token")?.value;

  if (!token) return false;

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    }
  );

  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user) return false;

  return user.user_metadata?.role === "admin";
}
