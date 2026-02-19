/**
 * Custom configuration with theme and plugins
 */
export interface EngineInputs {
    engine?: 'prism' | 'highlight' | 'shiki';
    theme: string;
    darkMode?: string | null;
}

export interface Resource {
    script?: string;
    link?: string;
    dependencies?: Resource[];
}

export interface PluginResource {
    script?: string;
    link?: string;
    dependencies?: PluginResource[];
}

export interface ConfigSection {
    urlPrefix: string;
    themes: Record<string, string>;
    plugins?: PluginResource[];
}

export interface EngineConfig {
    builtIn: ConfigSection;
    external?: {
        urlPrefix: string;
        themes: Record<string, string>;
    };
}

/**
 * Highlighting engine interface
 */
export interface HighlightEngine {
    /**
     * Initialize the engine with configuration
     * @param config - Engine configuration
     */
    initialize(config: EngineInputs): Promise<void>;

    /**
     * Execute syntax highlighting
     */
    highlight(): Promise<void>;
}
