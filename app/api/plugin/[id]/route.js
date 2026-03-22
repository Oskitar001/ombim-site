import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

export async function GET(req, { params }) {
  const plugin_id = params.id;

  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) {
    return NextResponse.json({ pago: null });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      global: { headers: { Authorization: `Bearer ${session}` } },
    }
  );

  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user;

  if (!user) {
    return NextResponse.json({ pago: null });
  }

  const { data: pago } = await supabase
    .from("pagos")
    .select("*")
    .eq("plugin_id", plugin_id)
    .eq("user_id", user.id)
    .maybeSingle();

  return NextResponse.json({ pago: pago || null });
}
