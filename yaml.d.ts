declare module '*.yaml' {
    interface PluginResource {
        script?: string;
        link?: string;
        dependencies?: PluginResource[];
    }

    interface ConfigSection {
        urlPrefix: string;
        themes: Record<string, string>;
        plugins?: PluginResource[];
    }

    interface EngineConfig {
        builtIn: ConfigSection;
        external?: {
            urlPrefix: string;
            themes: Record<string, string>;
        };
    }
    
    const value: EngineConfig;
    export default value;
}
