// /app/(site)/plugins/[id]/page.jsx
import PluginClient from "./PluginClient";

export const dynamic = "force-dynamic";

export default async function PluginPage({ params }) {
  // ✔ FIX para Next.js 15/16 — params es una PROMESA
  const { id } = await params;

  const base = process.env.NEXT_PUBLIC_SITE_URL || "";

  const res = await fetch(`${base}/api/plugin/${id}`, {
    cache: "no-store",
  });

  const plugin = await res.json();

  return <PluginClient plugin={plugin} pluginId={id} />;
}