// ======================================================
// API USUARIOS - CAMBIAR ROL - app/api/admin/users/role/route.js
// ======================================================
export async function POST(request) {
  const supabase = supabaseAdmin();
  const body = await request.json();
  const { userId, role } = body;

  if (!userId || !role) {
    return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
  }

  const { data, error } = await supabase.auth.admin.updateUserById(userId, {
    user_metadata: { role },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ user: data });
}