// @ts-check
/** @typedef {import('./types').HighlightConfig} HighlightConfig */
/** @typedef {import('./types').ThemeConfig} ThemeConfig */
/** @typedef {import('./types').ElementConfig} ElementConfig */
/** @typedef {import('./types').ConfigPack} ConfigPack */
/** @typedef {import('./types').CustomConfig} CustomConfig */

import ENGINES from "./engines/index.js";

(async function () {
  if (typeof document === "undefined") {
    return;
  }

  // Guard against multiple executions
  if (window.__highlightItInitialized) {
    return;
  }
  window.__highlightItInitialized = true;

  // ==================== Supported Configuration Packs ====================
  const SUPPORTED_PACKS = ["minimal", "complete"];
  const DEFAULT_ENGINE = "prism";

  // ==================== Utility Functions ====================
  /**
   * Waits for a condition to be met within a timeout period.
   * @param {() => boolean} condition - Function that returns true when condition is met
   * @param {number} [timeout=15000] - Maximum time to wait in milliseconds
   * @returns {Promise<void>}
   */
  function waitForCondition(condition, timeout = 15000) {
    return new Promise((resolve, reject) => {
      if (condition()) {
        resolve();
        return;
      }

      const startTime = Date.now();
      const interval = setInterval(() => {
        if (condition()) {
          clearInterval(interval);
          resolve();
        } else if (Date.now() - startTime > timeout) {
          clearInterval(interval);
          reject(
            new Error(
              "Highlighting engine failed to load within expected time."
            )
          );
        }
      }, 50);
    });
  }

  /**
   * Dynamically adds a script or stylesheet element to the document.
   * @param {string} baseUrl - Base URL for the resource
   * @param {ElementConfig} element - Element configuration
   * @returns {Promise<void>}
   */
  function addElement(baseUrl, { tagName, src }) {
    return new Promise((resolve, reject) => {
      if (tagName === "link") {
        const element = document.createElement("link");
        element.onload = () => resolve();
        element.onerror = () =>
          reject(new Error(`Failed to load ${tagName}: ${src}`));
        element.rel = "stylesheet";
        element.href = `${baseUrl}${src}`;
        document.body.appendChild(element);
      } else if (tagName === "script") {
        const element = document.createElement("script");
        element.onload = () => resolve();
        element.onerror = () =>
          reject(new Error(`Failed to load ${tagName}: ${src}`));
        element.defer = true;
        element.src = `${baseUrl}${src}`;
        document.body.appendChild(element);
      }
    });
  }

  /**
   * Parses configuration from script attributes.
   * @returns {HighlightConfig}
   */
  function parseConfiguration() {
    const scriptElement = document.currentScript;
    if (!scriptElement || scriptElement.tagName !== "SCRIPT") {
      return { engine: DEFAULT_ENGINE, pack: "minimal" };
    }

    const url =
      scriptElement instanceof HTMLScriptElement && scriptElement.src
        ? new URL(scriptElement.src)
        : null;

    // Determine engine (default to prism)
    let engineName = url?.searchParams.get("engine") || DEFAULT_ENGINE;
    if (!Object.prototype.hasOwnProperty.call(ENGINES, engineName)) {
      console.warn(
        `Unknown engine "${engineName}", falling back to ${DEFAULT_ENGINE}`
      );
      engineName = DEFAULT_ENGINE;
    }

    // Check for config pack in query string
    const packName =
      url?.searchParams.get("config") || url?.searchParams.get("pack");

    if (packName && SUPPORTED_PACKS.includes(packName)) {
      // Use engine-specific pack
      return { engine: engineName, pack: /** @type {ConfigPack} */ (packName) };
    }

    // Parse individual parameters for custom configuration
    /** @type {CustomConfig} */
    const config = { engine: engineName };

    // Theme from query string or class attribute
    const themeParam = url?.searchParams.get("theme");
    if (themeParam) {
      config.theme = parseTheme(themeParam);
    } else if (
      scriptElement instanceof HTMLScriptElement &&
      scriptElement.classList.length > 0
    ) {
      config.theme = parseThemeFromClasses(scriptElement.classList);
    }

    // Plugins from query string
    const pluginsParam = url?.searchParams.get("plugins");
    if (pluginsParam) {
      config.plugins = pluginsParam
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean);
    }

    return config;
  }

  /**
   * Parses theme from a string like "prism-dark" or "light:prism,dark:prism-okaidia"
   * @param {string} themeStr - Theme string to parse
   * @returns {ThemeConfig}
   */
  function parseTheme(themeStr) {
    const theme = { light: "prism", dark: "prism-dark" };

    if (!themeStr) return theme;

    // Handle simple theme name
    if (!themeStr.includes(":") && !themeStr.includes(",")) {
      theme.light = themeStr;
      theme.dark = themeStr;
      return theme;
    }

    // Handle "light:theme,dark:theme" format
    const parts = themeStr.split(",").map((s) => s.trim());
    parts.forEach((part) => {
      const [mode, name] = part.split(":").map((s) => s.trim());
      if (mode === "light" && name) {
        theme.light = name;
      } else if (mode === "dark" && name) {
        theme.dark = name;
      }
    });

    return theme;
  }

  /**
   * Parses theme from script element class list.
   * Example: class="dark:prism-okaidia prism-tomorrow"
   * @param {DOMTokenList} classList - Class list from script element
   * @returns {ThemeConfig}
   */
  function parseThemeFromClasses(classList) {
    /** @type {ThemeConfig} */
    const theme = { light: "prism", dark: null };

    Array.from(classList).forEach((className) => {
      if (className.startsWith("dark:")) {
        theme.dark = className.replace("dark:", "") || null;
      } else if (className.startsWith("light:")) {
        theme.light = className.replace("light:", "");
      } else {
        // No prefix means light theme
        if (!theme.light || theme.light === "prism") {
          theme.light = className;
        }
      }
    });

    return theme;
  }

  // ==================== Main Execution ====================
  try {
    const config = parseConfiguration();
    const engine = /** @type {import('./engines/index.js').default} */ (
      ENGINES
    )[config.engine];

    if (!engine) {
      throw new Error(`Unknown highlighting engine: ${config.engine}`);
    }

    // If using a pack, merge with engine-specific pack configuration
    let finalConfig;
    if (config.pack) {
      const enginePack = engine.packs?.[config.pack];
      if (!enginePack) {
        throw new Error(
          `Pack "${config.pack}" not supported by engine "${config.engine}"`
        );
      }
      finalConfig = { ...enginePack };
    } else {
      // Use custom configuration
      finalConfig = config;
    }

    await engine.initialize(finalConfig, addElement, waitForCondition);
    await engine.highlight();
  } catch (error) {
    console.error("highlight-it error:", error);
  }
})();
