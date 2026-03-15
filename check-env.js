import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

console.log("🔍 Validando variables de entorno...\n");

const REQUIRED_ENV = [
  "SUPABASE_URL",
  "SUPABASE_SERVICE_KEY",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "RESEND_API_KEY",
  "NEXT_PUBLIC_DOMAIN"
];

let missing = [];

for (const key of REQUIRED_ENV) {
  if (!process.env[key] || process.env[key].trim() === "") {
    missing.push(key);
  }
}

if (missing.length === 0) {
  console.log("✅ Todas las variables de entorno están correctamente definidas.\n");
  process.exit(0);
}

console.log("❌ Faltan variables de entorno:\n");
missing.forEach((key) => console.log(" - " + key));

console.log("\n💡 Solución:");
console.log("Añade las claves faltantes en tu archivo .env (NO solo .env.local)\n");

process.exit(1);
