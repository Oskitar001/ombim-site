import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    SUPABASE_URL: process.env.SUPABASE_URL || "NO_URL",
    SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY ? "OK" : "NO_KEY",
    ADMIN_EMAIL: process.env.ADMIN_EMAIL || "NO_ADMIN_EMAIL"
  });
}
