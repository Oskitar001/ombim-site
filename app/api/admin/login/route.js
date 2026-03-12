export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase";
import bcrypt from "bcryptjs";

export async function POST(req) {
  const { email, password } = await req.json();

  const { data: admin } = await supabase
    .from("admins")
    .select("*")
    .eq("email", email)
    .limit(1);

  if (!admin || admin.length === 0) {
    return NextResponse.json({ ok: false });
  }

  const valido = await bcrypt.compare(password, admin[0].password);

  if (!valido) {
    return NextResponse.json({ ok: false });
  }

  const res = NextResponse.json({ ok: true });

  res.cookies.set("admin_session", "true", {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return res;
}
