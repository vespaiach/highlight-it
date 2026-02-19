import BaseEngine from '@/engines/base';
import config from '@/engines/prism/config.yaml';
import type { EngineInputs, PluginResource, Resource } from '@/type';
import { assertString, log, error as logError, warn } from '@/utils';

/**
 * Prism.js Engine
 * Syntax highlighting engine powered by Prism.js
 */
export default class PrismEngine extends BaseEngine {
    private resources: Resource[] = [];

    constructor(inputs: EngineInputs) {
        super();
        const { theme, darkMode } = inputs;

        log('Loaded config:', config);
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

        const load = async (resource: Resource) => {
            await this.loadResource(resource);
        };

        try {
            // Add core script
            await load({ script: `${config.builtIn.urlPrefix}/components/prism-core.min.js` });
            log('Core script loaded.');

            // Load all resources
            await Promise.all(this.resources.map(load));
            log('[Prism Engine] All resources loaded.', this.resources);
        } catch (er) {
            logError('Error during initialization:', er);
            log('Resources attempted to load:', this.resources);
        }
    }

    setTheme(theme: string, darkMode: string) {
        const addBuiltInResource = (src: string) => {
            this.resources.push({ link: `${config.builtIn.urlPrefix}${src}` });
        };
        const addExternalResource = (src: string) => {
            this.resources.push({ link: `${config.external.urlPrefix}${src}` });
        };

        const isDarkMode = Boolean(darkMode) && window.matchMedia?.('(prefers-color-scheme: dark)').matches;
        if (isDarkMode && config.builtIn.themes[darkMode]) {
            addBuiltInResource(config.builtIn.themes[darkMode]);
            log(`[Prism Engine] Dark mode theme "${darkMode}" applied based on system preference.`);
            return;
        }
        if (!isDarkMode && config.builtIn.themes[theme]) {
            addBuiltInResource(config.builtIn.themes[theme]);
            log(`[Prism Engine] Theme "${theme}" applied based on system preference.`);
            return;
        }
        if (!isDarkMode && config.external.themes[theme]) {
            addExternalResource(config.external.themes[theme]);
            log(`[Prism Engine] External theme "${theme}" applied based on system preference.`);
            return;
        }
        if (isDarkMode && config.external.themes[darkMode]) {
            addExternalResource(config.external.themes[darkMode]);
            log(`[Prism Engine] External dark mode theme "${darkMode}" applied based on system preference.`);
            return;
        }

        addBuiltInResource(config.builtIn.themes.prism);
        warn(`[Prism Engine] Theme "${theme}" is not supported.`);
    }

    setPlugins() {
        // Add plugin
        config.builtIn.plugins?.forEach((plugin: PluginResource) => {
            this.resources.push({
                script: assertString(plugin.script)
                    ? `${config.builtIn.urlPrefix}${plugin.script}`
                    : undefined,
                link: assertString(plugin.link) ? `${config.builtIn.urlPrefix}${plugin.link}` : undefined,
                dependencies: plugin.dependencies?.map((dep: PluginResource) => ({
                    script: assertString(dep.script) ? `${config.builtIn.urlPrefix}${dep.script}` : undefined,
                    link: assertString(dep.link) ? `${config.builtIn.urlPrefix}${dep.link}` : undefined,
                })),
            });
        });

        // Add line-numbers class
        document.body.classList.add('line-numbers');
    }

    async highlight() {
        window.Prism?.highlightAll?.();
    }
}
