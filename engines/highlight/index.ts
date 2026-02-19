import BaseEngine from '@/engines/base';
import config from '@/engines/highlight/config.yaml';
import type { EngineInputs, Resource } from '@/type';
import { log, error as logError, warn } from '@/utils';

/**
 * Highlight.js Engine
 * Syntax highlighting engine powered by Highlight.js
 */
export default class HighlightEngine extends BaseEngine {
    private resources: Resource[] = [];

    constructor(inputs: EngineInputs) {
        super();
        const { theme, darkMode } = inputs;

        log('Loaded config:', config);
        this.setTheme(theme, darkMode || '');
    }

    async initialize() {
        const load = async (resource: Resource) => {
            await this.loadResource(resource);
        };

        try {
            // Add core script
            await load({ script: `${config.builtIn.urlPrefix}/highlight.min.js` });
            log('Core script loaded.');

            // Load all resources (themes)
            await Promise.all(this.resources.map(load));
            log('[Highlight Engine] All resources loaded.', this.resources);
        } catch (er) {
            logError('Error during initialization:', er);
            log('Resources attempted to load:', this.resources);
        }
    }

    setTheme(theme: string, darkMode: string) {
        const addBuiltInResource = (src: string) => {
            this.resources.push({ link: `${config.builtIn.urlPrefix}${src}` });
        };

        const isDarkMode = Boolean(darkMode) && window.matchMedia?.('(prefers-color-scheme: dark)').matches;
        
        if (isDarkMode && config.builtIn.themes[darkMode]) {
            addBuiltInResource(config.builtIn.themes[darkMode]);
            log(`[Highlight Engine] Dark mode theme "${darkMode}" applied based on system preference.`);
            return;
        }
        
        if (config.builtIn.themes[theme]) {
            addBuiltInResource(config.builtIn.themes[theme]);
            log(`[Highlight Engine] Theme "${theme}" applied.`);
            return;
        }

        // Default to 'default' theme if requested theme is not found
        addBuiltInResource(config.builtIn.themes.default);
        warn(`[Highlight Engine] Theme "${theme}" is not supported, defaulting to "default".`);
    }

    async highlight() {
        await this.waitUntil(() => Boolean(window.hljs));
        window.hljs?.highlightAll?.();
    }
}
