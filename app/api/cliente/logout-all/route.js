import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const token = req.cookies.get("client_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await supabase
      .from("dispositivos")
      .delete()
      .eq("usuario_id", decoded.id);

    return NextResponse.json({ ok: true });

  } catch (err) {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }
}
