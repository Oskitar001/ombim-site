import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    // cookies() ahora es ASÍNCRONO en Next.js 14
    const cookieStore = await cookies();
    const cookie = cookieStore.get("session");

    if (!cookie || !cookie.value) {
      return NextResponse.json({ user: null });
    }

    try {
      const user = JSON.parse(cookie.value);
      return NextResponse.json({ user });
    } catch (err) {
      console.error("Error al parsear cookie:", err);
      return NextResponse.json({ user: null });
    }

  } catch (err) {
    console.error("ME ERROR:", err);
    return NextResponse.json({ user: null });
  }
}
