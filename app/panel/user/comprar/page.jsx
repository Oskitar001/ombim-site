import { v4 as uuidv4 } from "uuid";

const paymentUID = useRef(uuidv4());   // se genera UNA VEZ

async function comprar(e) {
  e.preventDefault();

  const res = await fetch("/api/pagos/crear", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      plugin_id: pluginId,
      emails_tekla: emails,
      payment_uid: paymentUID.current
    })
  });
}
