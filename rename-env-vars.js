import fs from "fs";
import path from "path";

const ROOT = process.cwd();

const TARGETS = [
  {
    from: "SUPABASE_SERVICE_ROLE_KEY",
    to: "SUPABASE_SERVICE_ROLE_KEY"
  },
  {
    from: "SUPABASE_ANON_KEY",
    to: "SUPABASE_ANON_KEY" // por si quieres mantenerlo igual
  }
];

function scan(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);

    if (stat.isDirectory()) {
      scan(full);
    } else if (file.endsWith(".js") || file.endsWith(".jsx") || file.endsWith(".ts") || file.endsWith(".tsx")) {
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

console.log("🔍 Renombrando variables de entorno en el código...");
scan(ROOT);
console.log("✨ Proceso completado.");
