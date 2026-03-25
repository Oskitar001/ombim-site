import { supabaseRoute } from "@/lib/supabaseRoute";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const supabase = supabaseRoute();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "no_auth" }, { status: 401 });
  }

  const {
    nombre,
    empresa,
    telefono,
    pais,
    direccion,
    ciudad,
    cp,
    cif,
    idioma,
  } = await req.json();

  const { error } = await supabase.auth.updateUser({
    data: {
      nombre,
      empresa,
      telefono,
      pais,
      direccion,
      ciudad,
      cp,
      cif,
      idioma,
    },
  });

  if (error) {
    return Response.json({ error: "error_guardar" }, { status: 500 });
  }

  return Response.json({ ok: true });
}
``