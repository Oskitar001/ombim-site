// /app/panel/admin/page.jsx
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function AdminHome() {
  redirect("/panel/admin/dashboard");
}
``