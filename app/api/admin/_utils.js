import { supabaseServer } from "@/lib/supabaseServer";

export async function requireAdmin() {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "NO_AUTH", status: 401 };
  }

  if (user.user_metadata.role !== "admin") {
    return { error: "NO_ADMIN", status: 403 };
  }

  return { supabase, user };
}
