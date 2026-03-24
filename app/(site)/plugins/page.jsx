import { supabaseAdmin } from "@/lib/supabaseAdmin";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function PluginsPage() {
  const { data: plugins } = await supabaseAdmin
    .from("plugins")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <section className="max-w-5xl mx-auto py-20 px-6">
      <h1 className="text-4xl font-bold mb-10 text-center">Plugins</h1>

      {!plugins?.length && <p>No hay plugins disponibles todavía.</p>}

      <div className="grid md:grid-cols-2 gap-8">
        {plugins?.map((p) => (
          <Link key={p.id} href={`/plugins/${p.id}`} className="block">
            <div className="border rounded-xl p-6 bg-white dark:bg-[#1a1a1a] shadow hover:shadow-lg transition">
              <h2 className="text-2xl font-semibold mb-2">{p.nombre}</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-2">{p.descripcion}</p>
              <p className="font-bold text-blue-600 dark:text-blue-400">
                {p.precio > 0 ? `${p.precio} €` : "Gratis"}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}