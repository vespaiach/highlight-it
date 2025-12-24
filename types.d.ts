/**
 * Type definitions for highlight-it
 */

// ==================== Global Window Extensions ====================

declare global {
	interface Window {
		__highlightItInitialized?: boolean;
		Prism?: PrismAPI;
	}
}

// ==================== Configuration Types ====================

/**
 * Theme configuration supporting both light and dark modes
 */
export interface ThemeConfig {
	light: string;
	dark: string | null;
}

/**
 * Configuration pack names
 */
export type ConfigPack = "minimal" | "complete";

/**
 * Base configuration interface
 */
export interface BaseConfig {
	engine: string;
	pack?: ConfigPack;
}

/**
 * Custom configuration with theme and plugins
 */
export interface CustomConfig extends BaseConfig {
	theme?: ThemeConfig;
	plugins?: string[];
}

/**
 * Configuration from pack
 */
export interface PackConfig extends BaseConfig {
	pack: ConfigPack;
}

/**
 * Union type for all possible configurations
 */
export type HighlightConfig = BaseConfig | CustomConfig | PackConfig;

// ==================== Engine Types ====================

/**
 * Function to add a DOM element (script or link)
 */
export type AddElementFunction = (
	baseUrl: string,
	element: ElementConfig
) => Promise<void>;

/**
 * Function to wait for a condition to be met
 */
export type WaitForConditionFunction = (
	condition: () => boolean,
	timeout?: number
) => Promise<void>;

/**
 * Element configuration for adding scripts or stylesheets
 */
export interface ElementConfig {
	tagName: "script" | "link";
	src: string;
}

/**
 * Pack configuration for an engine
 */
export interface EnginePack {
	theme: ThemeConfig;
	plugins: string[];
}

/**
 * Engine packs collection
 */
export interface EnginePacks {
	minimal: EnginePack;
	complete: EnginePack;
	[key: string]: EnginePack;
}

/**
 * Plugin CSS dependencies mapping
 */
export interface PluginCssDependencies {
	[pluginName: string]: string;
}

/**
 * Highlighting engine interface
 */
export interface HighlightEngine {
	/**
	 * Base URL for loading engine resources
	 */
	baseUrl: string;

	/**
	 * Available theme names for this engine
	 */
	availableThemes: string[];

	/**
	 * Predefined configuration packs
	 */
	packs: EnginePacks;

	/**
	 * Mapping of plugin names to their CSS file paths
	 */
	pluginCssDependencies?: PluginCssDependencies;

	/**
	 * Initialize the engine with configuration
	 * @param config - Engine configuration
	 * @param addElement - Function to add DOM elements
	 * @param waitForCondition - Function to wait for conditions
	 */
	initialize(
		config: CustomConfig,
		addElement: AddElementFunction,
		waitForCondition: WaitForConditionFunction
	): Promise<void>;

	/**
	 * Execute syntax highlighting
	 */
	highlight(): Promise<void>;
}

/**
 * Registry of available engines
 */
export interface EngineRegistry {
	prism: HighlightEngine;
	[engineName: string]: HighlightEngine;
}

// ==================== Prism-Specific Types ====================

/**
 * Prism.js API interface
 */
export interface PrismAPI {
	manual: boolean;
	filename?: string;
	plugins?: {
		autoloader?: unknown;
		[pluginName: string]: unknown;
	};
	highlightAll(): void;
	highlightElement?(element: Element): void;
	highlightAllUnder?(element: Element): void;
}

// ==================== Utility Function Types ====================

/**
 * Parses configuration from script attributes and URL parameters
 * @returns Parsed configuration object
 */
export type ParseConfigurationFunction = () => HighlightConfig;

/**
 * Parses theme from a string
 * @param themeStr - Theme string to parse
 * @returns Theme configuration object
 */
export type ParseThemeFunction = (themeStr: string) => ThemeConfig;

/**
 * Parses theme from script element class list
 * @param classList - DOMTokenList from script element
 * @returns Theme configuration object
 */
export type ParseThemeFromClassesFunction = (
	classList: DOMTokenList
) => ThemeConfig;

export { };
