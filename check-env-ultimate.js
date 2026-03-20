import fs from "fs";
import jwt from "jsonwebtoken";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

console.log("🔍 Validando variables de entorno...\n");

// -------------------------------
// 1. Cargar archivos .env y .env.local
// -------------------------------
function loadEnvFile(file) {
  const filePath = path.join(process.cwd(), file);
  if (!fs.existsSync(filePath)) return {};

  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split("\n");

  const env = {};
  for (const line of lines) {
    if (!line.includes("=")) continue;
    const [key, ...rest] = line.split("=");
    env[key.trim()] = rest.join("=").trim();
  }
  return env;
}

const env = loadEnvFile(".env");
const envLocal = loadEnvFile(".env.local");

// -------------------------------
// 2. Lista de variables obligatorias + validadores
// -------------------------------
const REQUIRED = {
  SUPABASE_URL: {
    validate: (v) => v.startsWith("https://") && v.includes(".supabase.co"),
    message: "Debe ser una URL válida de Supabase (https://xxxx.supabase.co)"
  },

  SUPABASE_SERVICE_ROLE_KEY: {
    validate: (v) => {
      try {
        jwt.decode(v);
        return true;
      } catch {
        return false;
      }
    },
    message: "Debe ser un JWT válido (clave SERVICE_ROLE)"
  },

  STRIPE_SECRET_KEY: {
    validate: (v) => v.startsWith("sk_"),
    message: "Debe empezar por sk_"
  },

  STRIPE_WEBHOOK_SECRET: {
    validate: (v) => v.startsWith("whsec_"),
    message: "Debe empezar por whsec_"
  },

  RESEND_API_KEY: {
    validate: (v) => v.startsWith("re_"),
    message: "Debe empezar por re_"
  },

  NEXT_PUBLIC_DOMAIN: {
    validate: (v) => v.startsWith("http://") || v.startsWith("https://"),
    message: "Debe ser una URL válida (http:// o https://)"
  }
};

// -------------------------------
// 3. Validar existencia y formato
// -------------------------------
let errors = [];
let warnings = [];

for (const key in REQUIRED) {
  const value = process.env[key];

  if (!value || value.trim() === "") {
    errors.push(`❌ ${key} está vacía o no existe`);
    continue;
  }

  if (!REQUIRED[key].validate(value)) {
    errors.push(`❌ ${key} tiene un formato inválido → ${REQUIRED[key].message}`);
  }
}

// -------------------------------
// 4. Comparar .env y .env.local
// -------------------------------
for (const key in envLocal) {
  if (env[key] && envLocal[key] !== env[key]) {
    warnings.push(
      `⚠ ${key} tiene valores distintos en .env y .env.local\n   .env → ${env[key]}\n   .env.local → ${envLocal[key]}`
    );
  }
}

// -------------------------------
// 5. Detectar SERVICE_ROLE expuesto en variables públicas
// -------------------------------
for (const key in process.env) {
  if (key.startsWith("NEXT_PUBLIC") && process.env[key].includes("eyJ")) {
    errors.push(`❌ ${key} contiene un JWT. Nunca expongas SERVICE_ROLE en variables públicas.`);
  }
}

// -------------------------------
// 6. Mostrar resultados
// -------------------------------
if (errors.length === 0 && warnings.length === 0) {
  console.log("✅ Todas las variables de entorno son válidas y seguras.\n");
  process.exit(0);
}

if (errors.length > 0) {
  console.log("❌ Errores encontrados:\n");
  errors.forEach((e) => console.log(e));
}

if (warnings.length > 0) {
  console.log("\n⚠ Advertencias:\n");
  warnings.forEach((w) => console.log(w));
}

console.log("\n💡 Solución:");
console.log("Corrige las variables en tu archivo .env (NO solo .env.local)\n");

process.exit(1);
