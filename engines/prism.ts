import BaseEngine from './base';
import { log, warn, error as logError } from '../utils';
import type { CustomConfig, Resource } from '../type';

const URL_PREFIX = 'https://cdn.jsdelivr.net/gh/PrismJS/prism@1.30.0';
// Define the plugins to be used and their dependencies
const PLUGINS = [
    ['autoloader', false],
    ['toolbar', true],
    ['copy-to-clipboard', false],
    ['line-numbers', true],
    ['line-highlight', true]
];

const BUILT_IN_THEMES = ['coy', 'dark', 'funky', 'okaidia', 'solarizedlight', 'tomorrow', 'twilight', 'prism'];

/**
 * Prism.js Engine
 * Syntax highlighting engine powered by Prism.js
 */
export default class PrismEngine extends BaseEngine {
    private resources: Resource[] = [];

    constructor(config: CustomConfig) {
        super();
        const { theme, darkMode } = config;

        this.setTheme(theme, darkMode || '');
        this.setPlugins();
    }

    async initialize() {
        // Stop Prism from auto-highlighting
        if (!window.Prism) {
            window.Prism = { manual: true };
        } else {
            window.Prism.manual = true;
        }

        try {
            // Add core script
            await this.appendTo({ tagName: 'script', src: `${URL_PREFIX}/components/prism-core.min.js` }, 'body');
            await this.waitUntil(() => !!window.Prism?.filename);
            log('Core script loaded.');

            // Load all resources
            await Promise.all([
                ...this.resources.map((r) => this.appendTo(r, r.tagName === 'link' ? 'head' : 'body')),
                this.waitUntil(() => !!window.Prism?.plugins?.autoloader)
            ]);
            log('[Prism Engine] All resources loaded.', this.resources);
        } catch (er) {
            logError('Error during initialization:', er);
        }
    }

    setTheme(theme: string, darkMode: string) {
        const addToResource = (name: string) => {
            this.resources.push({
                tagName: 'link',
                src: `${URL_PREFIX}/themes/${name === 'prism' ? 'prism' : `prism-${name}`}.min.css`
            });
        };

        if (darkMode && BUILT_IN_THEMES.includes(darkMode)) {
            const isDarkMode = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
            addToResource(darkMode);
            log(
                `[Prism Engine] Dark mode theme "${darkMode}" will be applied automatically based on system preference (currently ${
                    isDarkMode ? 'dark' : 'light'
                } mode).`
            );
        } else if (BUILT_IN_THEMES.includes(theme)) {
            addToResource(theme);
        } else {
            addToResource('prism');
            warn(`[Prism Engine] Theme "${theme}" is not supported.`);
        }
    }

    setPlugins() {
        // Add plugin CSS
        PLUGINS.forEach((plugin) => {
            const [pluginName, needCss] = plugin;
            if (needCss) {
                this.resources.push({
                    tagName: 'link',
                    src: `${URL_PREFIX}/plugins/${pluginName}/prism-${pluginName}.min.css`
                });
            }

            this.resources.push({
                tagName: 'script',
                src: `${URL_PREFIX}/plugins/${pluginName}/prism-${pluginName}.min.js`
            });
        });

        // Add line-numbers class
        document.body.classList.add('line-numbers');
    }

    async highlight() {
        window.Prism?.highlightAll?.();
    }
}
