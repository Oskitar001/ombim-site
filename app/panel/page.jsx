import { supabaseServer } from "@/lib/supabaseServer";
import PanelClient from "./PanelClient";

export default async function PanelPage() {
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return redirect("/login");
  }

  return <PanelClient user={data.user} />;
}
