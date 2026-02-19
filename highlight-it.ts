/**
 * highlight-it - Main entry point
 * Parses script URL parameters and initializes the highlighting engine
 */

import { HighlightEngine, PrismEngine } from '@/engines';
import type BaseEngine from '@/engines/base';
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
        const { engine: engineName, theme, darkMode, verbose } = parseScriptParams();
        setVerbose(verbose);

        log('highlight-it initialized with config:', { engine: engineName, theme, darkMode, verbose });

        // Load the engine
        let engine: BaseEngine;
        if (engineName === 'highlight') {
            engine = new HighlightEngine({ theme, darkMode });
        } else {
            engine = new PrismEngine({ theme, darkMode });
        }

        // Initialize the engine with parsed configuration
        await engine.initialize();

        // Trigger syntax highlighting
        await engine.highlight();

        log('highlight-it: Code highlighting completed');
    } catch (err) {
        logError('highlight-it error:', err);
    }
})();
