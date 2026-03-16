// check-env.js
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

console.log("🔍 Validando variables de entorno...\n");

// 1. Cargar .env.local si existe
const envLocalPath = path.resolve(".env.local");
if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath });
}

// 2. Cargar .env (fallback)
dotenv.config();

// 3. Variables obligatorias
const REQUIRED = [
  "SUPABASE_URL",
  "SUPABASE_SERVICE_KEY",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "RESEND_API_KEY",
  "NEXT_PUBLIC_DOMAIN",
];

// 4. Detectar faltantes
const missing = REQUIRED.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.log("❌ Faltan variables de entorno:\n");
  missing.forEach((key) => console.log(" - " + key));

  console.log(`
💡 Solución:
Añade las claves faltantes en tu archivo .env o .env.local
`);

  process.exit(1); // ❗ Bloquea el build si faltan
}

console.log("✅ Todas las variables de entorno están presentes.\n");
