import { supabaseServer } from "./supabaseServer";

export async function requireAdmin() {
  const supabase = await supabaseServer();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    return { error: "No autenticado", status: 401 };
  }

  const user = data.user;

  if (user.user_metadata?.role !== "admin") {
    return { error: "No autorizado", status: 403 };
  }

  return { user, supabase };
}
