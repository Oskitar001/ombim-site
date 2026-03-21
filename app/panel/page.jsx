// ===============================
// app/panel/page.jsx
// ===============================
import { supabaseServer } from "@/lib/supabaseServer";
import PanelClient from "./PanelClient";
import { redirect } from "next/navigation";

export default async function PanelPage() {
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return redirect("/login");
  }

  return <PanelClient user={data.user} />;
}