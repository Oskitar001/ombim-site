import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const cookie = req.cookies.get("session");

    if (!cookie || !cookie.value) {
      return NextResponse.json({ user: null });
    }

    const session = cookie.value;

    try {
      const user = JSON.parse(session);
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
