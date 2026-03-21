// ======================================================
// API HARDWARE - app/api/admin/hardware/list/route.js
// (asume tabla "hardware" con columnas: id, user_id, tekla_email, machine_id, created_at)
// ======================================================
export async function GET() {
  const supabase = supabaseAdmin();
  const { data, error } = await supabase
    .from("hardware")
    .select("id,user_id,tekla_email,machine_id,created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ hardware: data });
}