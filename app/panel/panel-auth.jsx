// app/panel/panel-auth.jsx ✔️ corregido
"use server";

import { supabaseServer } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";

export default async function PanelAuth({ children }) {
  const supabase = await supabaseServer();

  const { data } = await supabase.auth.getUser();

  if (!data?.user) {
    redirect("/login");
  }

  return <>{children}</>;
}
