import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// Lista de variables obligatorias
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

console.log("🔍 Validando variables de entorno...\n");

let errors = [];

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

if (errors.length === 0) {
  console.log("✅ Todas las variables de entorno son válidas.\n");
  process.exit(0);
}

console.log("❌ Se encontraron problemas:\n");
errors.forEach((e) => console.log(e));

console.log("\n💡 Solución:");
console.log("Corrige las variables en tu archivo .env (NO solo .env.local)\n");

process.exit(1);
