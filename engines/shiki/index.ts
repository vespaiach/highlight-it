import BaseEngine from '@/engines/base';
import config from '@/engines/shiki/config.yaml';
import type { EngineInputs } from '@/type';
import { log, error as logError } from '@/utils';

/**
 * Shiki Engine
 * Syntax highlighting engine powered by Shiki
 */
export default class ShikiEngine extends BaseEngine {
    private theme: string;
    private darkModeTheme: string;
    private highlighter: any = null;
    private loadedLangs: Set<string> = new Set();

    constructor(inputs: EngineInputs) {
        super();
        this.theme = inputs.theme || 'vitesse-light';
        this.darkModeTheme = inputs.darkMode || 'vitesse-dark';
        log('Shiki Engine loaded with config:', config);
    }

    async initialize() {
        try {
            // Dynamically import shiki from CDN
            const shiki = await import(/* @lite-ignore */ config.url);
            
            this.highlighter = await shiki.createHighlighter({
                themes: [this.theme, this.darkModeTheme],
                langs: [] // Will be loaded on demand
            });
            
            this.loadedLangs.add('text');
            log('Shiki Engine initialized.');
        } catch (er) {
            logError('Error during Shiki initialization:', er);
        }
    }

    async highlight() {
        if (!this.highlighter) {
            logError('Shiki highlighter not initialized.');
            return;
        }

        const codeBlocks = document.querySelectorAll('pre code');
        const isDarkMode = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
        const activeTheme = (isDarkMode && this.darkModeTheme) ? this.darkModeTheme : this.theme;

        for (const codeBlock of Array.from(codeBlocks)) {
            const element = codeBlock as HTMLElement;
            const parent = element.parentElement;
            if (!parent || parent.tagName !== 'PRE') continue;

            // Extract language from class (e.g., language-js)
            const classNames = Array.from(element.classList);
            const langClass = classNames.find(c => c.startsWith('language-'));
            const lang = langClass ? langClass.replace('language-', '') : 'text';

            try {
                // Ensure language is loaded
                if (lang !== 'text' && !this.loadedLangs.has(lang)) {
                    await this.highlighter.loadLanguage(lang);
                    this.loadedLangs.add(lang);
                }

                const code = element.textContent || '';
                const html = this.highlighter.codeToHtml(code, {
                    lang,
                    theme: activeTheme
                });

                // Shiki's codeToHtml returns a full <pre> block.
                // We'll replace the existing <pre> block with the new one.
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = html;
                const newPre = tempDiv.firstChild as HTMLElement;
                
                if (newPre) {
                    // Transfer some classes if needed, or just replace
                    parent.replaceWith(newPre);
                }
            } catch (err) {
                logError(`Failed to highlight code block with language "${lang}":`, err);
            }
        }
    }
}
