import { supabaseServer } from "./supabaseServer";

export async function requireAdmin() {
  const supabase = await supabaseServer();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) return null;
  const user = data.user;

  if (user.user_metadata?.role !== "admin") return null;

  return user;
}
