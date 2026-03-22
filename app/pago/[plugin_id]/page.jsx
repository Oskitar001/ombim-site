import CompraLicencias from "./CompraLicencias";

export default async function Page({ params }) {
  const { plugin_id } = await params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/plugin/${plugin_id}`, {
    cache: "no-store",
  });

  const plugin = await res.json();

  return <CompraLicencias plugin={plugin} plugin_id={plugin_id} />;
}
