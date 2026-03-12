export const dynamic = "force-dynamic";

export default async function Page() {
  const data = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/admin/logs`)
    .then(r => r.json());

  return (
    <div>
      <h1>Logs</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
