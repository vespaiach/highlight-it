/**
 * Type definitions for highlight-it
 */

export interface Resource {
	tagName: "script" | "link";
	src: string;
}


/**
 * Custom configuration with theme and plugins
 */
export interface CustomConfig {
	pack?: 'minimal' | 'complete';
	darkMode?: boolean;
	verbose: boolean;
}

/**
 * Highlighting engine interface
 */
export interface HighlightEngine {
	/**
	 * Initialize the engine with configuration
	 * @param config - Engine configuration
	 */
	initialize(config: CustomConfig): Promise<void>;

	/**
	 * Execute syntax highlighting
	 */
	highlight(): Promise<void>;
}

