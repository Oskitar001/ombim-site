import fs from "fs";
import path from "path";

const ROOT = process.cwd();

const API_DIR = path.join(ROOT, "app/api");
const APP_DIR = path.join(ROOT, "app");
const LIB_DIR = path.join(ROOT, "lib");

function walk(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;

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

function extractRoutes(files) {
  return files
    .filter(f => f.includes("app/api"))
    .map(f => f.replace(ROOT, "").replace(/\\/g, "/"));
}

function extractImports(file) {
  const content = fs.readFileSync(file, "utf8");
  const regex = /from\s+["'](.+?)["']/g;

  const imports = [];
  let match;

  while ((match = regex.exec(content)) !== null) {
    imports.push(match[1]);
  }

  return imports;
}

console.log("🔍 Iniciando auditoría profunda…\n");

const apiFiles = walk(API_DIR);
const appFiles = walk(APP_DIR);
const libFiles = walk(LIB_DIR);

const allFiles = [...apiFiles, ...appFiles, ...libFiles];

console.log("📌 Rutas API detectadas:");
const routes = extractRoutes(apiFiles);
routes.forEach(r => console.log("  •", r));

console.log("\n📌 Buscando rutas API duplicadas…");
const duplicates = routes.filter((r, i) => routes.indexOf(r) !== i);

if (duplicates.length === 0) {
  console.log("  ✔ No hay rutas duplicadas");
} else {
  duplicates.forEach(d => console.log("  ❌ Duplicada:", d));
}

console.log("\n📌 Buscando imports muertos…");

const importMap = {};

allFiles.forEach(file => {
  const imports = extractImports(file);
  importMap[file] = imports;
});

const deadImports = [];

Object.entries(importMap).forEach(([file, imports]) => {
  imports.forEach(imp => {
    if (
      imp.startsWith(".") &&
      !fs.existsSync(path.join(path.dirname(file), imp + ".js")) &&
      !fs.existsSync(path.join(path.dirname(file), imp + ".jsx")) &&
      !fs.existsSync(path.join(path.dirname(file), imp))
    ) {
      deadImports.push({ file, imp });
    }
  });
});

if (deadImports.length === 0) {
  console.log("  ✔ No hay imports muertos");
} else {
  deadImports.forEach(d =>
    console.log("  ❌ Import muerto:", d.imp, "en", d.file)
  );
}

console.log("\n📌 Buscando APIs no usadas por el frontend…");

const frontendContent = appFiles
  .map(f => fs.readFileSync(f, "utf8"))
  .join("\n");

const unusedAPIs = routes.filter(r => !frontendContent.includes(r));

if (unusedAPIs.length === 0) {
  console.log("  ✔ Todas las APIs son usadas por el frontend");
} else {
  unusedAPIs.forEach(r => console.log("  ⚠️ API no usada:", r));
}

console.log("\n📌 Buscando archivos JS/JSX no usados…");

const allContent = allFiles
  .map(f => fs.readFileSync(f, "utf8"))
  .join("\n");

const unusedFiles = allFiles.filter(f => {
  const name = path.basename(f).replace(".js", "").replace(".jsx", "");
  return !allContent.includes(name) && !f.includes("page") && !f.includes("layout");
});

if (unusedFiles.length === 0) {
  console.log("  ✔ No hay archivos muertos");
} else {
  unusedFiles.forEach(f => console.log("  ⚠️ Archivo no usado:", f));
}

console.log("\n✅ Auditoría profunda completada.");
