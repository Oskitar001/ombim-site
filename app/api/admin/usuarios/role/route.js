import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req) {
  const { id, role } = await req.json();

  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(id, {
    user_metadata: { role }
  });

  if (error) return Response.json({ error }, { status: 500 });

  return Response.json({ ok: true });
}