import { NextResponse } from "next/server";
import { supabase } from "../../../../../lib/supabase";

export async function GET(req, { params }) {
  const { id } = params;

  const { data: users } = await supabase
    .from("usuarios")
    .select("*")
    .eq("id", id)
    .limit(1);

  const user = users?.[0];

  const { data: dispositivos } = await supabase
    .from("dispositivos")
    .select("*")
    .eq("usuario_id", id);

  return NextResponse.json({
    ...user,
    dispositivos: dispositivos || [],
  });
}
