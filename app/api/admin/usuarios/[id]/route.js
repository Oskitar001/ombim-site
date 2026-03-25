import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(_, { params }) {
  const { id } = params;

  const { data, error } = await supabaseAdmin.auth.admin.getUserById(id);

  if (error) return Response.json({ error }, { status: 500 });

  return Response.json({ user: data.user });
}