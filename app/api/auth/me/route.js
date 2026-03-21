import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET() {
  try {
    const supabase = await supabaseServer();

    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      return NextResponse.json({ user: null, role: null });
    }

    const user = data.user;

    // ⭐ AÑADIMOS EL NOMBRE DIRECTAMENTE
    const nombre =
      user.user_metadata?.nombre ||
      user.user_metadata?.member ||
      null;

    const role = user.user_metadata?.role ?? "user";

    return NextResponse.json({
      user: {
        ...user,
        nombre // ⭐ AHORA EL NAVBAR LO RECIBE
      },
      role
    });

  } catch (err) {
    console.error("ME ERROR:", err);
    return NextResponse.json({ user: null, role: null });
  }
}
