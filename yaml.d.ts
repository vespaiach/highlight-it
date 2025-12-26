declare module '*/prism/config.yaml' {
    interface PrismPlugin {
        script?: string;
        link?: string;
        dependencies?: PrismPlugin[];
    }

    interface PrismConfigSection {
        urlPrefix: string;
        themes: Record<string, string>;
        plugins: PrismPlugin[];
    }

    interface PrismConfig {
        builtIn: PrismConfigSection;
        external: {
            urlPrefix: string;
            themes: Record<string, string>;
        };
    }
    
    const value: PrismConfig;
    export default value;
}
