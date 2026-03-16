import { createClient } from "@supabase/supabase-js";

export async function GET(req) {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  // Si viene un ID → devolver un plugin
  if (id) {
    const { data, error } = await supabase
      .from("plugins")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error obteniendo plugin:", error);
      return Response.json(null);
    }

    return Response.json(data);
  }

  // Si NO viene ID → devolver todos los plugins
  const { data, error } = await supabase
    .from("plugins")
    .select("*");

  if (error) {
    console.error("Error obteniendo plugins:", error);
    return Response.json([]);
  }

  return Response.json(data);
}
