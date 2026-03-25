import { supabaseServer } from "./supabaseServer";

export async function requireAdmin() {
  const supabase = await supabaseServer();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    return { ok: false, redirect: "/login" };
  }

  const role = data.user.user_metadata?.role ?? "user";

  if (role !== "admin") {
    return { ok: false, redirect: "/panel/user" };
  }

  return { ok: true, user: data.user };
}