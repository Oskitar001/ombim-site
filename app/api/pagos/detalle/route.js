import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const plugin_id = searchParams.get("plugin_id");

  if (!plugin_id) {
    return NextResponse.json({ error: "Falta plugin_id" }, { status: 400 });
  }

  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) {
    return NextResponse.json({ error: "NO_LOGIN" }, { status: 401 });
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

  const { data: pago } = await supabase
    .from("pagos")
    .select("*")
    .eq("plugin_id", plugin_id)
    .eq("user_id", user.id)
    .single();

  return NextResponse.json({ pago });
}
