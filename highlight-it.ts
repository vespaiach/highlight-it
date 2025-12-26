/**
 * highlight-it - Main entry point
 * Parses script URL parameters and initializes the highlighting engine
 */

import { PrismEngine } from '@/engines';
import { log, error as logError, parseScriptParams, setVerbose } from '@/utils';

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
