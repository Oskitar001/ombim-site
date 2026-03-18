import { cookies } from "next/headers";

export async function checkAdmin() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;

  if (!sessionCookie) return null;

  const session = JSON.parse(sessionCookie);
  if (session.role !== "admin") return null;

  return session;
}
