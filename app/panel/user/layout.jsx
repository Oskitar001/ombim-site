// app/panel/user/layout.jsx ✔️ corregido
import { requireUser } from "@/lib/requireUser";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function UserLayout({ children }) {
  const auth = await requireUser();

  if (!auth.ok) {
    redirect(auth.redirect);
  }

  return (
    <>
      <h3>Mi panel</h3>

      <nav className="flex gap-4 my-4">
        <Link href="/panel/user">Inicio</Link>
        <Link href="/panel/mis-licencias">Mis licencias</Link>
        <Link href="/panel/mis-plugins">Mis plugins</Link>
        <Link href="/panel/mis-descargas">Mis descargas</Link>
        <Link href="/panel/mis-pagos">Mis pagos</Link>
        <Link href="/panel/mis-facturas">Mis facturas</Link>
        <Link href="/panel/facturacion">Datos de facturación</Link>
      </nav>

      {children}
    </>
  );
}