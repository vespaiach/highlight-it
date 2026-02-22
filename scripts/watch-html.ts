import { watch } from "node:fs";
import { copyFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";

const src = "docs/index.html";
const dest = "dist/index.html";

async function copy() {
  try {
    await mkdir(dirname(dest), { recursive: true });
    await copyFile(src, dest);
    console.log(`[watch-html] Copied ${src} to ${dest}`);
  } catch (e) {
    console.error(`[watch-html] Error copying file:`, e);
  }
}

// Initial copy
copy();

console.log(`[watch-html] Watching ${src}...`);
watch("docs", { recursive: false }, async (_event, filename) => {
  if (filename === "index.html") {
    await copy();
  }
});
