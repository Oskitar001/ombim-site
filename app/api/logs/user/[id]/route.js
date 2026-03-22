import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

export async function GET(req, { params }) {
  const sessionCookie = cookies().get("session")?.value;

  if (!sessionCookie) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const session = JSON.parse(sessionCookie);

  if (session.id !== params.id && session.role !== "admin") {
    return NextResponse.json({ error: "Prohibido" }, { status: 403 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SECRET_KEY
  );

  const { data, error } = await supabase
    .from("logs")
    .select("*")
    .eq("usuario_id", params.id)
    .order("fecha", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
