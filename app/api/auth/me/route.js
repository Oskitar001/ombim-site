import { NextResponse } from "next/server";

export async function GET(req) {
  const session = req.cookies.get("session")?.value;

  if (!session) {
    return NextResponse.json({ user: null });
  }

  try {
    const user = JSON.parse(session);
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ user: null });
  }
}
