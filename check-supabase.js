import fs from "fs";
import path from "path";

const apiDir = path.join(process.cwd(), "app", "api");

const errors = [];

function scanDir(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      scanDir(fullPath);
    } else if (file.endsWith(".js") || file.endsWith(".jsx")) {
      checkFile(fullPath);
    }
  }
}

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");

  // Buscar createClient
  if (content.includes("createClient")) {
    const hasURL = content.includes("process.env.SUPABASE_URL");
    const hasService = content.includes("process.env.SUPABASE_SERVICE_ROLE_KEY");
    const hasAnon = content.includes("SUPABASE_ANON_KEY");

    if (!hasURL || !hasService) {
      errors.push({
        file: filePath,
        issue: !hasURL
          ? "❌ Falta SUPABASE_URL"
          : "❌ Falta SUPABASE_SERVICE_ROLE_KEY",
      });
    }

    if (hasAnon) {
      errors.push({
        file: filePath,
        issue: "⚠ Usa ANON_KEY (no recomendado en rutas admin)",
      });
    }
  }
}

console.log("🔍 Escaneando rutas API...");
scanDir(apiDir);

if (errors.length === 0) {
  console.log("✅ Todas las rutas usan correctamente SUPABASE_URL y SERVICE_ROLE");
} else {
  console.log("\n❗ Problemas encontrados:\n");
  errors.forEach((e) => {
    console.log(`Archivo: ${e.file}`);
    console.log(`Problema: ${e.issue}\n`);
  });
}
