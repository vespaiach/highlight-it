import type { EngineInputs } from './type';

/**
 * Logger utility that respects verbose configuration
 */
let verboseMode = false;

export function setVerbose(enabled: boolean): void {
    verboseMode = enabled;
}

export function log(...args: unknown[]): void {
    if (verboseMode) {
        console.log('[highlight-it LOG]: ', ...args);
    }
}

export function warn(...args: unknown[]): void {
    if (verboseMode) {
        console.warn('[highlight-it WARN]: ', ...args);
    }
}

export function error(...args: unknown[]): void {
    // Errors are always shown regardless of verbose mode
    console.error('[highlight-it ERROR]: ', ...args);
}

export function appendToBody(resource: { tagName: 'script' | 'link'; src: string }): Promise<void> {
    const { tagName, src } = resource;

    let resolve: () => void;
    let reject: (error: Error) => void;
    const promise = new Promise<void>((res, rej) => {
        [resolve, reject] = [res, rej];
    });

    let element: HTMLScriptElement | HTMLLinkElement;
    if (tagName === 'link') {
        element = document.createElement('link');
        element.rel = 'stylesheet';
        element.href = src;
    } else {
        element = document.createElement('script');
        element.defer = true;
        element.src = src;
    }
    element.onload = () => {
        resolve();
    };
    element.onerror = () => {
        reject(new Error(`Failed to load ${tagName}: ${src}`));
    };

    document.body.appendChild(element);

    return promise;
}

export function parseScriptParams() {
    const scriptElement = document.currentScript;

    // Default configuration
    const config: EngineInputs & { verbose: boolean } = {
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

export function assertString(value: string | undefined | null): value is string {
    return Boolean(value);
}
