/**
 * Custom configuration with theme and plugins
 */
export interface EngineInputs {
    theme: string;
    darkMode?: string | null;
}

export interface Resource {
    script?: string;
    link?: string;
	dependencies?: Resource[];
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
