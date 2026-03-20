export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("sb-access-token")?.value;

  if (!accessToken) {
    return NextResponse.json({ error: "NO_LOGIN" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data: userData, error: userError } = await supabase.auth.getUser(accessToken);

  if (userError || !userData?.user) {
    return NextResponse.json({ error: "NO_LOGIN" }, { status: 401 });
  }

  const user = userData.user;

  const { data, error } = await supabase
    .from("licencias")
    .select("*")
    .eq("user_id", user.id)
    .order("fecha_creacion", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "ERROR_DB" }, { status: 500 });
  }

  return NextResponse.json(data);
}
