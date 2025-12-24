const esbuild = require("esbuild");

// Build TypeScript version (highlight-it.ts)
esbuild
  .build({
    entryPoints: ["highlight-it.ts"],
    outfile: `dist/highlight-it.js`,
    bundle: true,
    platform: "browser",
    format: "iife",
    minify: true,
    sourcemap: true,
    target: ["es2020", "chrome58", "edge58", "firefox58", "safari13"],
  })
  .then(() => {
    console.log(`Build completed: highlight-it.js`);
  })
  .catch(() => process.exit(1));
