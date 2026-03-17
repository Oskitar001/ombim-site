import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const sessionCookie = cookies().get("session")?.value;

  if (!sessionCookie) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const session = JSON.parse(sessionCookie);

  if (session.role !== "admin") {
    return NextResponse.json({ error: "Solo admin" }, { status: 403 });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE
  );

  const { data, error } = await supabase
    .from("hardware")
    .select("*");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
