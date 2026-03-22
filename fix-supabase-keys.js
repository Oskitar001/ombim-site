import fs from "fs";
import path from "path";

const ROOT = process.cwd();

const FILES_TO_SCAN = [
  "app/api",
  "lib"
];

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

function fileNeedsSecretKey(content) {
  const needsSession =
    content.includes("auth.getUser") ||
    content.includes("cookies()") ||
    content.includes("cookieStore") ||
    content.includes("Authorization: `Bearer") ||
    content.includes("user_id") ||
    content.includes("eq(\"user_id\"") ||
    content.includes("eq('user_id'");

  return needsSession;
}

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");

  if (!content.includes("NEXT_PUBLIC_SUPABASE_ANON_KEY")) return;

  if (!fileNeedsSecretKey(content)) return;

  const updated = content.replace(
    /process\.env\.NEXT_PUBLIC_SUPABASE_ANON_KEY/g,
    "process.env.SUPABASE_SECRET_KEY"
  );

  if (updated !== content) {
    fs.writeFileSync(filePath, updated, "utf8");
    console.log("🔧 Corregido:", filePath);
  }
}

console.log("🔍 Escaneando APIs y librerías…");

FILES_TO_SCAN.forEach(folder => {
  const fullPath = path.join(ROOT, folder);
  const files = walk(fullPath);

  files.forEach(fixFile);
});

console.log("✅ Corrección completada.");
