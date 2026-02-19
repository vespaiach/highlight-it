/**
 * Type definitions for highlight-it
 */

// ==================== Global Window Extensions ====================

declare global {
    interface Window {
        __highlightItInitialized?: boolean;
        Prism?: {
            manual: boolean;
            filename?: string;
            plugins?: { autoloader?: any };
            highlightAll?: () => void;
        };
        hljs?: {
            highlightAll: () => void;
            configure: (options: any) => void;
        };
    }
}

export {};
