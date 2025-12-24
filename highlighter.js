// @ts-check
/**
 * Highlighter Manager
 * Manages syntax highlighting with web worker support and main thread fallback
 */

/** @typedef {import('./types').HighlightConfig} HighlightConfig */
/** @typedef {import('./types').Highlighter} Highlighter */
/** @typedef {import('./types').WorkerMessage} WorkerMessage */
/** @typedef {import('./types').WorkerResponse} WorkerResponse */
/** @typedef {import('./types').HighlightEngine} HighlightEngine */

/**
 * Creates a highlighter that uses web workers when available, falls back to main thread
 * @param {HighlightEngine} engine - The highlighting engine to use
 * @param {import('./types').AddElementFunction} addElement - Function to add DOM elements
 * @param {import('./types').WaitForConditionFunction} waitForCondition - Function to wait for conditions
 * @returns {Highlighter}
 */
export function createHighlighter(engine, addElement, waitForCondition) {
  const isWorkerSupported = typeof Worker !== "undefined";

  if (isWorkerSupported) {
    return new WorkerHighlighter(engine, addElement, waitForCondition);
  } else {
    return new MainThreadHighlighter(engine, addElement, waitForCondition);
  }
}

/**
 * Web Worker-based highlighter
 * @implements {Highlighter}
 */
class WorkerHighlighter {
  /**
   * @param {HighlightEngine} engine
   * @param {import('./types').AddElementFunction} addElement
   * @param {import('./types').WaitForConditionFunction} waitForCondition
   */
  constructor(engine, addElement, waitForCondition) {
    this.engine = engine;
    this.addElement = addElement;
    this.waitForCondition = waitForCondition;
    this.worker = null;
    this.pendingRequests = new Map();
    this.requestId = 0;
    this.useMainThread = false;
  }

  /**
   * Initialize the highlighter
   * @param {HighlightConfig} config
   */
  async initialize(config) {
    // First load CSS resources in main thread (workers can't access DOM)
    await this.loadDOMResources(config);

    // Try to initialize worker
    try {
      // Get the worker script URL - look for it relative to the main script
      let workerUrl;

      // Try to find the script element that loaded highlight-it
      const scripts = document.querySelectorAll('script[src*="highlight-it"]');
      if (scripts.length > 0) {
        const scriptSrc = /** @type {HTMLScriptElement} */ (
          scripts[scripts.length - 1]
        ).src;
        const baseUrl = scriptSrc.substring(0, scriptSrc.lastIndexOf("/"));
        workerUrl = `${baseUrl}/highlight-worker.js`;
      } else {
        // Fallback: assume worker is in the same directory
        workerUrl = "./highlight-worker.js";
      }

      this.worker = new Worker(workerUrl);

      // Set up message handler
      this.worker.onmessage = (event) => {
        this.handleWorkerMessage(event.data);
      };

      this.worker.onerror = (error) => {
        console.error("Worker error:", error);
        this.useMainThread = true;
      };

      // Initialize worker
      await this.sendWorkerMessage({ type: "init", config });
    } catch (error) {
      console.warn(
        "Failed to initialize worker, falling back to main thread:",
        error
      );
      this.useMainThread = true;

      // Fallback to main thread initialization
      await this.engine.initialize(
        config,
        this.addElement,
        this.waitForCondition
      );
    }
  }

  /**
   * Load DOM resources (CSS, fonts) that workers can't handle
   * @param {HighlightConfig} config
   */
  async loadDOMResources(config) {
    /** @type {Array<import('./types').ElementConfig>} */
    const resources = [];
    const { theme, plugins } = /** @type {import('./types').CustomConfig} */ (
      config
    );

    if (!theme || !plugins) {
      return;
    }

    // Add theme CSS
    const isDarkMode =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const selectedTheme = isDarkMode ? theme.dark ?? theme.light : theme.light;

    resources.push({
      tagName: "link",
      src: `/themes/${selectedTheme}.min.css`,
    });

    // Add plugin CSS
    if (this.engine.pluginCssDependencies) {
      plugins.forEach((plugin) => {
        if (
          this.engine.pluginCssDependencies &&
          this.engine.pluginCssDependencies[plugin]
        ) {
          resources.push({
            tagName: "link",
            src: this.engine.pluginCssDependencies[plugin],
          });
        }
      });
    }

    // Add line-numbers class if requested
    if (plugins.includes("line-numbers")) {
      document.body.classList.add("line-numbers");
    }

    // Load all CSS resources
    for (const resource of resources) {
      await this.addElement(this.engine.baseUrl, resource);
    }
  }

  /**
   * Send a message to the worker and wait for response
   * @param {WorkerMessage} message
   * @returns {Promise<WorkerResponse>}
   */
  sendWorkerMessage(message) {
    return new Promise((resolve, reject) => {
      if (!this.worker) {
        reject(new Error("Worker not initialized"));
        return;
      }

      const id = `req_${this.requestId++}`;
      message.id = id;

      this.pendingRequests.set(id, { resolve, reject });
      this.worker.postMessage(message);

      // Timeout after 30 seconds
      setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id);
          reject(new Error("Worker request timeout"));
        }
      }, 30000);
    });
  }

  /**
   * Handle messages from worker
   * @param {WorkerResponse} response
   */
  handleWorkerMessage(response) {
    const id = response.id;
    if (!id || !this.pendingRequests.has(id)) {
      return;
    }

    const { resolve, reject } = this.pendingRequests.get(id);
    this.pendingRequests.delete(id);

    if (response.success) {
      resolve(response);
    } else {
      reject(new Error(response.error || "Worker request failed"));
    }
  }

  /**
   * Highlight all code blocks
   */
  async highlightAll() {
    if (this.useMainThread || !this.worker) {
      // Fallback to main thread
      await this.engine.highlight();
      return;
    }

    // For now, use main thread for DOM manipulation
    // In the future, we could send code blocks to worker and update DOM
    await this.engine.highlight();
  }

  /**
   * Highlight a specific element
   * @param {Element} element
   */
  async highlightElement(element) {
    if (this.useMainThread || !this.worker) {
      // Fallback to main thread
      if (window.Prism?.highlightElement) {
        window.Prism.highlightElement(element);
      }
      return;
    }

    // Extract code and language
    const code = element.textContent || "";
    const language = this.extractLanguage(element);

    if (!language) {
      return;
    }

    try {
      const response = await this.sendWorkerMessage({
        type: "highlight",
        code,
        language,
      });

      if (response.code) {
        element.innerHTML = response.code;
        element.classList.add("language-" + language);
      }
    } catch (error) {
      console.error("Failed to highlight element in worker:", error);
      // Fallback to main thread
      if (window.Prism?.highlightElement) {
        window.Prism.highlightElement(element);
      }
    }
  }

  /**
   * Extract language from element classes
   * @param {Element} element
   * @returns {string | null}
   */
  extractLanguage(element) {
    const classes = Array.from(element.classList);
    for (const className of classes) {
      if (className.startsWith("language-")) {
        return className.replace("language-", "");
      }
    }
    return null;
  }

  /**
   * Destroy the highlighter and clean up resources
   */
  destroy() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    this.pendingRequests.clear();
  }
}

/**
 * Main thread highlighter (fallback)
 * @implements {Highlighter}
 */
class MainThreadHighlighter {
  /**
   * @param {HighlightEngine} engine
   * @param {import('./types').AddElementFunction} addElement
   * @param {import('./types').WaitForConditionFunction} waitForCondition
   */
  constructor(engine, addElement, waitForCondition) {
    this.engine = engine;
    this.addElement = addElement;
    this.waitForCondition = waitForCondition;
  }

  /**
   * Initialize the highlighter
   * @param {HighlightConfig} config
   */
  async initialize(config) {
    await this.engine.initialize(
      config,
      this.addElement,
      this.waitForCondition
    );
  }

  /**
   * Highlight all code blocks
   */
  async highlightAll() {
    await this.engine.highlight();
  }

  /**
   * Highlight a specific element
   * @param {Element} element
   */
  async highlightElement(element) {
    if (window.Prism?.highlightElement) {
      window.Prism.highlightElement(element);
    }
  }

  /**
   * Destroy the highlighter
   */
  destroy() {
    // Nothing to clean up in main thread mode
  }
}
