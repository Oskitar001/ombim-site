import PagoClient from "./PagoClient";

export default async function PagoPage(props) {
  const { id } = await props.params; // ✔ Next 16 lo permite
  return <PagoClient id={id} />;
}
