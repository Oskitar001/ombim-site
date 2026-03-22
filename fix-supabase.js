import fs from "fs";
import path from "path";

const apiDir = path.join(process.cwd(), "app", "api");

function scanDir(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      scanDir(fullPath);
    } else if (file.endsWith(".js") || file.endsWith(".jsx")) {
      fixFile(fullPath);
    }
  }
}

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");

  if (!content.includes("createClient")) return;

  let changed = false;

  // Asegurar import correcto
  if (!content.includes(`@supabase/supabase-js`)) {
    content =
      `import { createClient } from "@supabase/supabase-js";\n` + content;
    changed = true;
  }

  // Reemplazar ANON_KEY por SERVICE_ROLE
  if (content.includes("NEXT_PUBLIC_SUPABASE_ANON_KEY")) {
    content = content.replace(/NEXT_PUBLIC_SUPABASE_ANON_KEY/g, "SUPABASE_SECRET_KEY");
    changed = true;
  }

  // Asegurar que se pasan las dos variables
  const regexClient = /createClient\(([^)]+)\)/;

  if (!content.includes("process.env.SUPABASE_SECRET_KEY")) {
    content = content.replace(
      regexClient,
      `createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)`
    );
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`✔ Arreglado: ${filePath}`);
  }
}

console.log("🔍 Revisando y corrigiendo rutas API...");
scanDir(apiDir);
console.log("✨ Revisión completada.");
