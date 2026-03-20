const fs = require("fs");
const path = require("path");

const TARGET_EXT = [".js", ".jsx", ".ts", ".tsx"];

// NUEVOS COLORES PREMIUM
const REPLACEMENTS = [
  // 🌑 MODO OSCURO (nuevo)
  ["dark:bg-[#242424]", "dark:bg-[#242424]"],
  ["dark:bg-[#242424]Soft", "dark:bg-[#2e2e2e]"],
  ["dark:border-[#3a3a3a]", "dark:border-[#3a3a3a]"],
  ["dark:text-[#e6e6e6]", "dark:text-[#e6e6e6]"],

  // ☀️ MODO CLARO (nuevo)
  ["bg-[#f3f4f6]", "bg-[#f3f4f6]"],
  ["bg-[#f3f4f6]Soft", "bg-[#ffffff]"],
  ["border-[#d1d5db]", "border-[#d1d5db]"],
  ["text-[#1f2937]", "text-[#1f2937]"],

  // LIMPIEZA DE COLORES ANTIGUOS
  ["dark:bg-[#242424]", "dark:bg-[#242424]"],
  ["dark:bg-[#242424]", "dark:bg-[#242424]"],
  ["dark:bg-[#242424]", "dark:bg-[#242424]"],
  ["dark:bg-[#2e2e2e]", "dark:bg-[#2e2e2e]"],
  ["dark:bg-[#242424]", "dark:bg-[#242424]"],
  ["dark:border-[#3a3a3a]", "dark:border-[#3a3a3a]"],
  ["dark:border-[#3a3a3a]", "dark:border-[#3a3a3a]"],
  ["dark:text-[#e6e6e6]", "dark:text-[#e6e6e6]"],
  ["dark:text-[#e6e6e6]", "dark:text-[#e6e6e6]"],
  ["dark:from-[#242424]", "dark:from-[#242424]"],
  ["dark:to-[#242424]", "dark:to-[#242424]"],

  ["bg-[#ffffff]", "bg-[#ffffff]"],
  ["bg-[#f3f4f6]", "bg-[#f3f4f6]"],
  ["bg-[#f3f4f6]", "bg-[#f3f4f6]"],
  ["border-[#d1d5db]", "border-[#d1d5db]"],
  ["border-[#d1d5db]", "border-[#d1d5db]"],
  ["text-[#1f2937]", "text-[#1f2937]"],
  ["text-[#1f2937]", "text-[#1f2937]"],
  ["text-[#1f2937]", "text-[#1f2937]"],
  ["from-[#f3f4f6]", "from-[#f3f4f6]"],
  ["to-[#f3f4f6]", "to-[#f3f4f6]"]
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  let original = content;

  REPLACEMENTS.forEach(([search, replace]) => {
    const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
    content = content.replace(regex, replace);
  });

  if (content !== original) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log("✔ Modificado:", filePath);
  }
}

function walk(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);

    if (fs.statSync(fullPath).isDirectory()) {
      if (["node_modules", ".next", ".git"].includes(file)) continue;
      walk(fullPath);
    } else {
      if (TARGET_EXT.includes(path.extname(fullPath))) {
        processFile(fullPath);
      }
    }
  }
}

console.log("🔧 Aplicando nuevos colores premium...");
walk(process.cwd());
console.log("✨ Tema actualizado correctamente");
