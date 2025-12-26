/**
 * highlight-it - Main entry point
 * Parses script URL parameters and initializes the highlighting engine
 */

import { PrismEngine } from './engines';
import type { CustomConfig } from './type';
import { log, setVerbose, error as logError, warn } from './utils';

(async () => {
    // Only run in browser environment
    if (typeof document === 'undefined') {
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
    function parseScriptParams() {
        const scriptElement = document.currentScript;

        // Default configuration
        const config: CustomConfig & { verbose: boolean } = {
            theme: 'prism',
            darkMode: '',
            verbose: false
        };

        // Parse URL parameters if script element is available
        if (scriptElement && scriptElement instanceof HTMLScriptElement && scriptElement.src) {
            try {
                const url = new URL(scriptElement.src);

                // Get pack parameter (config or pack)
                config.theme = url.searchParams.get('theme') || url.searchParams.get('config') || 'prism';

                // Get darkmode parameter
                config.darkMode = url.searchParams.get('darkmode') || url.searchParams.get('darkMode');

                // Get verbose parameter
                const verboseParam = url.searchParams.get('verbose');
                if (verboseParam) {
                    config.verbose = ['true', '1', 'yes', 'on'].includes(verboseParam.toLowerCase());
                }
            } catch (error) {
                warn('Failed to parse script URL:', error);
                return config;
            }
        }

        return config;
    }

    // ==================== Main Execution ====================
    try {
        const { theme, darkMode, verbose } = parseScriptParams();
        setVerbose(verbose);

        log('highlight-it initialized with config:', { theme, darkMode, verbose });

        // Load the engine (currently only Prism.js is supported)
        const engine = new PrismEngine({ theme, darkMode });

        // Initialize the engine with parsed configuration
        await engine.initialize();

        // Trigger syntax highlighting
        await engine.highlight();

        log('highlight-it: Code highlighting completed');
    } catch (err) {
        logError('highlight-it error:', err);
    }
})();
