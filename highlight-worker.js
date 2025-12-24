// @ts-check
/**
 * Web Worker for syntax highlighting
 * Performs highlighting operations off the main thread
 */

/** @typedef {import('./types').HighlightConfig} HighlightConfig */
/** @typedef {import('./types').WorkerMessage} WorkerMessage */
/** @typedef {import('./types').WorkerResponse} WorkerResponse */

/** @type {any} */
let Prism = null;
/** @type {HighlightConfig | null} */
let engineConfig = null;

/**
 * Handles messages from the main thread
 */
self.addEventListener("message", async (event) => {
  /** @type {WorkerMessage} */
  const message = event.data;

  try {
    switch (message.type) {
      case "init":
        if (!message.config) {
          throw new Error("Config is required for init");
        }
        await initializeEngine(message.config);
        /** @type {WorkerResponse} */
        const initResponse = { type: "init", success: true };
        self.postMessage(initResponse);
        break;

      case "highlight":
        if (!message.code || !message.language) {
          throw new Error("Code and language are required for highlight");
        }
        const highlighted = await highlightCode(message.code, message.language);
        /** @type {WorkerResponse} */
        const highlightResponse = {
          type: "highlight",
          success: true,
          code: highlighted,
          id: message.id,
        };
        self.postMessage(highlightResponse);
        break;

      default:
        throw new Error(`Unknown message type: ${message.type}`);
    }
  } catch (error) {
    /** @type {WorkerResponse} */
    const errorResponse = {
      type: message.type,
      success: false,
      error: error instanceof Error ? error.message : String(error),
      id: message.id,
    };
    self.postMessage(errorResponse);
  }
});

/**
 * Initializes the highlighting engine in the worker
 * @param {HighlightConfig} config - Configuration for the engine
 */
async function initializeEngine(config) {
  engineConfig = config;

  // Load Prism.js core in the worker
  try {
    // Import Prism from CDN
    const baseUrl = "https://cdn.jsdelivr.net/gh/PrismJS/prism@1.30.0";
    const scripts = [];

    // Load core
    scripts.push(`${baseUrl}/components/prism-core.min.js`);

    // Load plugins if specified
    const customConfig = /** @type {import('./types').CustomConfig} */ (config);
    if (customConfig.plugins) {
      for (const plugin of customConfig.plugins) {
        if (plugin !== "line-numbers" && plugin !== "line-highlight") {
          // These plugins require DOM, skip them in worker
          scripts.push(`${baseUrl}/plugins/${plugin}/prism-${plugin}.min.js`);
        }
      }
    }

    // Import all scripts
    for (const scriptUrl of scripts) {
      try {
        // @ts-ignore - importScripts is available in worker context
        importScripts(scriptUrl);
      } catch (error) {
        console.warn(`Failed to load ${scriptUrl} in worker:`, error);
      }
    }

    // Get Prism from global scope
    if (self.Prism) {
      Prism = self.Prism;
      Prism.manual = true;
    } else {
      throw new Error("Prism failed to load in worker");
    }
  } catch (error) {
    throw new Error(
      `Failed to initialize engine: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

/**
 * Highlights code using the loaded engine
 * @param {string} code - Code to highlight
 * @param {string} language - Programming language
 * @returns {Promise<string>} Highlighted HTML
 */
async function highlightCode(code, language) {
  if (!Prism) {
    throw new Error("Engine not initialized");
  }

  try {
    // Ensure language grammar is loaded
    if (Prism.languages[language]) {
      const highlighted = Prism.highlight(
        code,
        Prism.languages[language],
        language
      );
      return highlighted;
    } else {
      // If autoloader is available, try to load the language
      if (Prism.plugins?.autoloader) {
        // Autoloader will load the language automatically
        // But in worker context, we might need to handle this differently
        return code; // Fallback to unhighlighted code
      }
      return code;
    }
  } catch (error) {
    console.error("Highlighting error:", error);
    return code; // Return original code on error
  }
}
