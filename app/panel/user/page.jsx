// /app/panel/user/page.jsx
import { supabaseServer } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

export default async function PanelUsuarioPage() {
  const supabase = await supabaseServer();

  const { data: userData } = await supabase.auth.getUser();

  if (!userData?.user) {
    return <p>Debes iniciar sesión.</p>;
  }

  const user = userData.user;

  return (
    <div>
      <h2>Panel de usuario</h2>
      <p>Nombre: {user.user_metadata?.nombre ?? user.email}</p>
      <p>Email: {user.email}</p>
    </div>
  );
}