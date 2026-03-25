import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req) {
  const { id } = await req.json();

  const { error } = await supabaseAdmin.auth.admin.deleteUser(id);

  if (error) return Response.json({ error }, { status: 500 });

  return Response.json({ ok: true });
}