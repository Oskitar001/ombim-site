import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const ROOT = process.cwd();

const EXCLUDE = [
  "node_modules",
  ".next",
  ".git",
  ".vercel",
  "public"
];

const TARGETS = [
  {
    from: "SUPABASE_SERVICE_ROLE_KEY",
    to: "SUPABASE_SERVICE_ROLE_KEY"
  }
];

function scan(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const full = path.join(dir, file);

    // Excluir carpetas que no deben tocarse
    if (EXCLUDE.some((ex) => full.includes(ex))) continue;

    const stat = fs.statSync(full);

    if (stat.isDirectory()) {
      scan(full);
    } else if (/\.(js|jsx|ts|tsx)$/.test(file)) {
      fix(full);
    }
  }
}

function fix(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  let changed = false;

  for (const rule of TARGETS) {
    if (content.includes(rule.from)) {
      content = content.replace(new RegExp(rule.from, "g"), rule.to);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log("✔ Renombrado en:", filePath);
  }
}

console.log("🔍 Renombrando variables de entorno en el código (modo seguro)...");
scan(ROOT);
console.log("✨ Proceso completado.");
