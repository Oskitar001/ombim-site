import { supabaseServer } from "./supabaseServer";

export async function requireUser() {
  const supabase = await supabaseServer();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    return { ok: false, redirect: "/login" };
  }

  return { ok: true, user: data.user };
}