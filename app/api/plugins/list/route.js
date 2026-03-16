import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  const { data, error } = await supabase
    .from("plugins")
    .select("*");

  if (error) {
    console.error("Error en /api/plugins/list:", error);
    return Response.json([]);
  }

  return Response.json(data);
}
