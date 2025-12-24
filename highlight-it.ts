/**
 * highlight-it - Main entry point
 * Parses script URL parameters and initializes the highlighting engine
 */

import type { CustomConfig } from "./type";
import engines from "./engines";
import { setVerbose, log, warn, error as logError } from "./utils";

(async function () {
    // Only run in browser environment
    if (typeof document === "undefined") {
        return;
    }

    // Guard against multiple executions
    if (window.__highlightItInitialized) {
        return;
    }
    window.__highlightItInitialized = true;

    /**
     * Parses configuration from the script's URL parameters
     * Extracts 'pack' and 'darkmode' parameters
     */
    function parseScriptParams(): CustomConfig {
        const scriptElement = document.currentScript;

        // Default configuration
        const config: CustomConfig = {
            pack: "minimal",
            darkMode: false,
            verbose: false,
        };

        // Parse URL parameters if script element is available
        if (scriptElement && scriptElement instanceof HTMLScriptElement && scriptElement.src) {
            try {
                const url = new URL(scriptElement.src);

                // Get pack parameter (config or pack)
                const packParam = url.searchParams.get("pack") || url.searchParams.get("config");
                if (packParam && (packParam === "minimal" || packParam === "complete")) {
                    config.pack = packParam;
                }

                // Get darkmode parameter
                const darkModeParam = url.searchParams.get("darkmode") || url.searchParams.get("darkMode");
                if (darkModeParam) {
                    // Accept: true, 1, yes, on
                    config.darkMode = ["true", "1", "yes", "on"].includes(darkModeParam.toLowerCase());
                } else {
                    // Auto-detect dark mode from system preference
                    config.darkMode = window.matchMedia &&
                        window.matchMedia("(prefers-color-scheme: dark)").matches;
                }

                // Get verbose parameter
                const verboseParam = url.searchParams.get("verbose");
                if (verboseParam) {
                    config.verbose = ["true", "1", "yes", "on"].includes(verboseParam.toLowerCase());
                }
            } catch (error) {
                warn("Failed to parse script URL:", error);
            }
        } else {
            // Auto-detect dark mode if no script element
            config.darkMode = window.matchMedia &&
                window.matchMedia("(prefers-color-scheme: dark)").matches;
        }

        return config;
    }

    // ==================== Main Execution ====================
    try {
        // TODO: Support multiple engines in the future
        const DEFAULT_ENGINE = 'prism';

        const config = parseScriptParams();

        // Set verbose mode for logger
        setVerbose(config.verbose);

        log("highlight-it initialized with config:", config);

        // Load the engine (currently only Prism.js is supported)
        const engine = engines[DEFAULT_ENGINE];

        // Initialize the engine with parsed configuration
        await engine.initialize(config);

        // Trigger syntax highlighting
        await engine.highlight();

        log("highlight-it: Code highlighting completed");
    } catch (err) {
        logError("highlight-it error:", err);
    }
})();
