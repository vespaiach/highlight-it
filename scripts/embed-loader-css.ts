// This script reads src/shiki-loader/loader.css, minifies it to a single line,
// and injects it into the LOADER_CSS constant in the built bundle
// at public/shiki-loader.js. It is meant to be run *after* bundling.

// Bun runtime global (available when running via `bun run`).
declare const Bun: {
  file(path: string): {
    exists(): Promise<boolean>;
    text(): Promise<string>;
  };
  write(path: string, data: string): Promise<void>;
};

const cssPath = "src/shiki-loader/loader.css";
const jsBundlePath = "public/shiki-loader.js";

async function main() {
  const cssFile = Bun.file(cssPath);
  if (!(await cssFile.exists())) {
    console.error(`embed-loader-css: CSS file not found at ${cssPath}`);
    process.exit(1);
  }

  const jsFile = Bun.file(jsBundlePath);
  if (!(await jsFile.exists())) {
    console.error(`embed-loader-css: bundle file not found at ${jsBundlePath}. Did you run bun build first?`);
    process.exit(1);
  }

  const cssRaw = await cssFile.text();

  // Simple minification: collapse all whitespace into single spaces and trim.
  const minifiedCss = cssRaw.replace(/\s+/g, " ").trim();

  let jsSource = await jsFile.text();

  // Ensure the placeholder string is present before attempting replacement.
  if (!jsSource.includes("LOADER_CSS placeholder")) {
    console.error("embed-loader-css: LOADER_CSS placeholder string not found in bundle");
    process.exit(1);
  }

  // Replace the LOADER_CSS placeholder string literal while preserving the surrounding quote style.
  // We intentionally match on the placeholder comment text, not on the variable name,
  // because bundling/minification may rename the constant.
  const pattern =
    /(=\s*)(['"])\/\* LOADER_CSS placeholder - this will be replaced with the contents of loader\.css \*\/(\2)/;

  if (!pattern.test(jsSource)) {
    console.error("embed-loader-css: Failed to locate LOADER_CSS assignment in bundle");
    process.exit(1);
  }

  jsSource = jsSource.replace(pattern, (_match, prefix, quote) => {
    const escapedCss = minifiedCss.replace(/\\/g, "\\\\").replace(new RegExp(quote, "g"), `\\${quote}`);
    return `${prefix}${quote}${escapedCss}${quote}`;
  });

  await Bun.write(jsBundlePath, jsSource);
  console.log("embed-loader-css: Injected minified loader.css into LOADER_CSS in bundle");
}

void main();
