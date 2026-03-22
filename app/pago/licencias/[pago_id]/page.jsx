import AsignarEmailsClient from "./AsignarEmailsClient";

export default async function Page({ params }) {
  const { pago_id } = await params; // ← CORRECTO AQUÍ

  return <AsignarEmailsClient pago_id={pago_id} />;
}
