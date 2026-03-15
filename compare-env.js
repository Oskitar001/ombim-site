import fs from "fs";
import path from "path";

function loadEnv(file) {
  const filePath = path.join(process.cwd(), file);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf8");

  // Detectar BOM
  if (raw.charCodeAt(0) === 0xFEFF) {
    console.log(`⚠ El archivo ${file} tiene BOM (UTF-16). Debe ser UTF-8 sin BOM.`);
  }

  const lines = raw.split(/\r?\n/);
  const env = {};

  for (const line of lines) {
    if (!line.includes("=")) continue;
    const [key, ...rest] = line.split("=");
    env[key.trim()] = rest.join("=").trim();
  }

  return env;
}

console.log("🔍 Comparando .env y .env.local...\n");

const env = loadEnv(".env");
const envLocal = loadEnv(".env.local");

if (!env) {
  console.log("❌ No existe el archivo .env en la raíz del proyecto.");
  process.exit(1);
}

if (!envLocal) {
  console.log("⚠ No existe .env.local (esto es normal en producción).");
}

let warnings = [];
let errors = [];

// Comparar claves
for (const key in env) {
  const base = env[key];
  const local = envLocal?.[key];

  if (!base || base.trim() === "") {
    errors.push(`❌ ${key} en .env está vacío`);
  }

  if (local && local.trim() === "") {
    warnings.push(`⚠ ${key} en .env.local está vacío`);
  }

  if (local && local !== base) {
    warnings.push(
      `⚠ ${key} tiene valores distintos:\n   .env → ${base}\n   .env.local → ${local}`
    );
  }
}

// Buscar claves en .env.local que no existen en .env
if (envLocal) {
  for (const key in envLocal) {
    if (!env[key]) {
      warnings.push(`⚠ ${key} existe en .env.local pero NO en .env`);
    }
  }
}

if (errors.length === 0 && warnings.length === 0) {
  console.log("✅ Los archivos .env y .env.local son consistentes.\n");
  process.exit(0);
}

if (errors.length > 0) {
  console.log("❌ Errores:\n");
  errors.forEach((e) => console.log(e));
}

if (warnings.length > 0) {
  console.log("\n⚠ Advertencias:\n");
  warnings.forEach((w) => console.log(w));
}

console.log("\n💡 Revisa tus archivos .env y .env.local.\n");
process.exit(1);
