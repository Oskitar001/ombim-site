"use server";

import { supabaseServer } from "./supabaseServer";

export async function requireUser() {
  const supabase = supabaseServer();
  const { data } = await supabase.auth.getUser();

  if (!data?.user) {
    return { ok: false, redirect: "/login" };
  }

  return { ok: true, user: data.user };
}
