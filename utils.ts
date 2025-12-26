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
