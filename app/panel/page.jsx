import { supabaseServer } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";

export default async function PanelPage() {
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();

  if (!data?.user) {
    redirect("/login");
  }

  return (
    <div className="pt-32 px-6">
      <h1 className="text-2xl font-bold">Panel de usuario</h1>
      <p>Bienvenido, {data.user.email}</p>
    </div>
  );
}
