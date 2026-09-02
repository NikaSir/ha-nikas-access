import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = join(root, "custom_components", "nikas_access", "frontend", "src");
const outputPath = join(root, "custom_components", "nikas_access", "frontend", "nikas-access-panel.js");
const sourceFiles = [
  "constants.js",
  "data/perimeters.js",
  "data/intercom.js",
  "views/statuses-view.js",
  "views/gates-view.js",
  "views/intercom-view.js",
  "views/diagnostics-view.js",
  "styles.js",
  "nikas-access-panel.js",
];

const banner = `/* NikaS Access v0.1.4 | generated from frontend/src | do not edit bundle directly */\n`;
const bundle = `${banner}${sourceFiles.map((file) => {
  const body = readFileSync(join(sourceRoot, file), "utf8").trimEnd();
  return `\n/* source: ${file} */\n${body}\n`;
}).join("")}`;

if (process.argv.includes("--check")) {
  let current = "";
  try {
    current = readFileSync(outputPath, "utf8");
  } catch (_error) {
    console.error("Frontend bundle is missing. Run: node scripts/build.mjs");
    process.exit(1);
  }
  if (current !== bundle) {
    console.error("Frontend bundle differs from frontend/src. Run: node scripts/build.mjs");
    process.exit(1);
  }
  console.log("frontend bundle is current");
} else {
  writeFileSync(outputPath, bundle, "utf8");
  console.log(`built ${outputPath}`);
}
