// ======================================================
// API LOGS - app/api/admin/logs/list/route.js
// (asume tabla "logs" con columnas: id, level, message, context, created_at)
// ======================================================
export async function GET() {
  const supabase = supabaseAdmin();
  const { data, error } = await supabase
    .from("logs")
    .select("id,level,message,context,created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ logs: data });
}