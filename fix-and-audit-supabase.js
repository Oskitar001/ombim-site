import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const DIRECTORIES = ["app/api", "lib"];

function walk(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);

    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath, fileList);
    } else if (fullPath.endsWith(".js") || fullPath.endsWith(".jsx")) {
      fileList.push(fullPath);
    }
  }

  return fileList;
}

function needsSession(content) {
  return (
    content.includes("auth.getUser") ||
    content.includes("cookies()") ||
    content.includes("cookieStore") ||
    content.includes("Authorization: `Bearer") ||
    content.includes("user_id") ||
    content.includes("eq(\"user_id\"") ||
    content.includes("eq('user_id'")
  );
}

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");

  const usesAnon = content.includes("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  const usesSecret = content.includes("SUPABASE_SECRET_KEY");
  const sessionRequired = needsSession(content);

  console.log("📄", filePath);

  if (usesAnon && sessionRequired) {
    console.log("  ❌ ERROR: Usa ANON KEY pero requiere sesión → CORREGIDO");
    content = content.replace(
      /process\.env\.NEXT_PUBLIC_SUPABASE_ANON_KEY/g,
      "process.env.SUPABASE_SECRET_KEY"
    );
    fs.writeFileSync(filePath, content, "utf8");
    return;
  }

  if (usesAnon && !sessionRequired) {
    console.log("  ⚠️ Aviso: Usa ANON KEY (correcto si es pública)");
    return;
  }

  if (usesSecret && !sessionRequired) {
    console.log("  ⚠️ Aviso: Usa SECRET KEY pero no parece necesitar sesión");
    return;
  }

  if (usesSecret && sessionRequired) {
    console.log("  ✅ Correcto: Usa SECRET KEY y requiere sesión");
    return;
  }

  if (!usesAnon && !usesSecret) {
    console.log("  ❓ No usa ninguna clave Supabase");
    return;
  }
}

console.log("🔍 Escaneando y corrigiendo APIs…\n");

DIRECTORIES.forEach(folder => {
  const fullPath = path.join(ROOT, folder);
  const files = walk(fullPath);
  files.forEach(fixFile);
});

console.log("\n✅ Auditoría + Corrección completada.");
