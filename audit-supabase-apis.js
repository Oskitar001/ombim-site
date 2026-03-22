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

function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");

  const usesAnon = content.includes("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  const usesSecret = content.includes("SUPABASE_SECRET_KEY");

  const needsSession =
    content.includes("auth.getUser") ||
    content.includes("cookies()") ||
    content.includes("cookieStore") ||
    content.includes("Authorization: `Bearer") ||
    content.includes("user_id") ||
    content.includes("eq(\"user_id\"") ||
    content.includes("eq('user_id'");

  const isAPI = filePath.includes("app/api");

  return {
    filePath,
    usesAnon,
    usesSecret,
    needsSession,
    isAPI
  };
}

console.log("🔍 Analizando APIs y librerías…\n");

const results = [];

DIRECTORIES.forEach(folder => {
  const fullPath = path.join(ROOT, folder);
  const files = walk(fullPath);
  files.forEach(file => results.push(analyzeFile(file)));
});

console.log("📌 RESULTADOS\n");

results.forEach(r => {
  const { filePath, usesAnon, usesSecret, needsSession, isAPI } = r;

  if (!isAPI) return;

  console.log("📄", filePath);

  if (usesAnon && needsSession) {
    console.log("  ❌ ERROR: Usa ANON KEY pero requiere sesión");
  }

  if (usesAnon && !needsSession) {
    console.log("  ⚠️ Aviso: Usa ANON KEY (correcto si es pública)");
  }

  if (usesSecret && !needsSession) {
    console.log("  ⚠️ Aviso: Usa SECRET KEY pero no parece necesitar sesión");
  }

  if (!usesAnon && !usesSecret) {
    console.log("  ❓ No usa ninguna clave Supabase");
  }

  if (usesSecret && needsSession) {
    console.log("  ✅ Correcto: Usa SECRET KEY y requiere sesión");
  }

  console.log("");
});

console.log("✅ Auditoría completada.");
