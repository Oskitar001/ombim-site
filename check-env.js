// check-env.js (CommonJS, compatible con Vercel)
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

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
  "NEXT_PUBLIC_SITE_URL", // ← ESTA ES LA IMPORTANTE
];


// 4. Detectar faltantes
const missing = REQUIRED.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.log("❌ Faltan variables de entorno:\n");
  missing.forEach((key) => console.log(" - " + key));

  console.log(`
💡 Solución:
Añade las claves faltantes en .env o .env.local
`);

  process.exit(1);
}

console.log("✅ Todas las variables de entorno están presentes.\n");
