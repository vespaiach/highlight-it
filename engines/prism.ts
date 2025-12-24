import type { HighlightEngine, Resource } from "../type";
import { addElement, waitForCondition } from "../utils";

const BASE_URL = "https://cdn.jsdelivr.net/gh/PrismJS/prism@1.30.0";

const PACKS = {
    minimal: {
        theme: { light: "prism", dark: "prism" },
        plugins: [],
    },
    complete: {
        theme: { light: "prism-solarizedlight", dark: "prism-twilight" },
        plugins: [
            "autoloader",
            ["line-numbers", "/plugins/line-numbers/prism-line-numbers.min.css"],
            ["line-highlight", "/plugins/line-highlight/prism-line-highlight.min.css"],
        ],
    },
};

/**
 * Prism.js Engine
 * Syntax highlighting engine powered by Prism.js
 */
const engine: HighlightEngine = {
    async initialize(config) {
        const { pack = "minimal", darkMode = false } = config;

        // Stop Prism from auto-highlighting
        if (!window.Prism) {
            window.Prism = { manual: true, };
        } else {
            window.Prism.manual = true;
        }

        const resources: Resource[] = [];
        const packConfig = PACKS[pack];

        // Add theme CSS
        const selectedTheme = darkMode ? packConfig.theme.dark : packConfig.theme.light;
        resources.push({
            tagName: "link",
            src: `${BASE_URL}/themes/${selectedTheme}.min.css`,
        });

        // Add plugin CSS
        const plugins = packConfig.plugins;
        plugins.forEach((plugin) => {
            const [pluginName, ...dependencies] = Array.isArray(plugin) ? plugin : [plugin];
            dependencies.forEach((src) => {
                resources.push({ tagName: "link", src });
            })
            resources.push({ tagName: "script", src: `${BASE_URL}/plugins/${pluginName}/prism-${pluginName}.min.js`, });
        });

        // Add core script
        resources.push({ tagName: "script", src: `${BASE_URL}/components/prism-core.min.js` });
        // Add line-numbers class if that plugin is requested
        if (pack === "complete") {
            document.body.classList.add("line-numbers");
        }

        // Load all resources
        const loadingResources = [
            ...resources.map(addElement),
            waitForCondition(() => !!window.Prism?.filename),
            waitForCondition(() => !!window.Prism?.plugins?.autoloader)
        ];
        await Promise.all(loadingResources);
    },

    async highlight() {
        window.Prism?.highlightAll?.();
    },
};

export default engine;