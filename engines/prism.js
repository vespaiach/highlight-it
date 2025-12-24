// @ts-check
/**
 * Prism.js Engine
 * Syntax highlighting engine powered by Prism.js
 * @type {import('../types').HighlightEngine}
 */
export default {
  baseUrl: "https://cdn.jsdelivr.net/gh/PrismJS/prism@1.30.0",

  availableThemes: [
    "prism",
    "prism-coy",
    "prism-dark",
    "prism-funky",
    "prism-okaidia",
    "prism-solarizedlight",
    "prism-tomorrow",
    "prism-twilight",
  ],

  // Configuration packs for this engine
  packs: {
    minimal: {
      theme: { light: "prism", dark: "prism" },
      plugins: [],
    },
    complete: {
      theme: { light: "prism-solarizedlight", dark: "prism-twilight" },
      plugins: ["autoloader", "line-numbers", "line-highlight", "toolbar"],
    },
  },

  pluginCssDependencies: {
    "line-numbers": "/plugins/line-numbers/prism-line-numbers.min.css",
    "line-highlight": "/plugins/line-highlight/prism-line-highlight.min.css",
    toolbar: "/plugins/toolbar/prism-toolbar.min.css",
    "command-line": "/plugins/command-line/prism-command-line.min.css",
  },

  async initialize(config, addElement, waitForCondition) {
    // Stop Prism from auto-highlighting
    if (!window.Prism) {
      /** @type {import('../types').PrismAPI} */
      window.Prism = {
        manual: true,
        highlightAll: () => {},
      };
    } else {
      window.Prism.manual = true;
    }

    /** @type {Array<import('../types').ElementConfig>} */
    const resources = [];
    const { theme, plugins } = config;

    if (!theme || !plugins) {
      throw new Error("Theme and plugins are required in config");
    }

    // Add theme CSS
    const isDarkMode =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const selectedTheme = isDarkMode ? theme.dark ?? theme.light : theme.light;

    /** @type {import('../types').ElementConfig} */
    const themeResource = {
      tagName: "link",
      src: `/themes/${selectedTheme}.min.css`,
    };
    resources.push(themeResource);

    // Add plugin CSS
    plugins.forEach((plugin) => {
      if (this.pluginCssDependencies && this.pluginCssDependencies[plugin]) {
        /** @type {import('../types').ElementConfig} */
        const pluginCssResource = {
          tagName: "link",
          src: this.pluginCssDependencies[plugin],
        };
        resources.push(pluginCssResource);
      }
    });

    // Add core script
    /** @type {import('../types').ElementConfig} */
    const coreResource = {
      tagName: "script",
      src: "/components/prism-core.min.js",
    };
    resources.push(coreResource);

    // Add plugin scripts
    plugins.forEach((plugin) => {
      /** @type {import('../types').ElementConfig} */
      const pluginResource = {
        tagName: "script",
        src: `/plugins/${plugin}/prism-${plugin}.min.js`,
      };
      resources.push(pluginResource);
    });

    // Add line-numbers class if that plugin is requested
    if (plugins.includes("line-numbers")) {
      document.body.classList.add("line-numbers");
    }

    // Load all resources
    for (const resource of resources) {
      await addElement(this.baseUrl, resource);
    }

    // Wait for Prism to be ready
    await waitForCondition(() => !!window.Prism?.filename);
    if (plugins.includes("autoloader")) {
      await waitForCondition(() => !!window.Prism?.plugins?.autoloader);
    }
  },

  async highlight() {
    if (window.Prism) {
      window.Prism.highlightAll();
    }
  },
};
