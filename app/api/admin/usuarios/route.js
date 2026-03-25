import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.toLowerCase() || "";

  const { data, error } = await supabaseAdmin.auth.admin.listUsers();

  if (error) return Response.json({ error }, { status: 500 });

  let users = data.users;

  if (query) {
    users = users.filter((u) =>
      u.email?.toLowerCase().includes(query) ||
      u.id?.toLowerCase().includes(query)
    );
  }

  return Response.json({ users });
}
