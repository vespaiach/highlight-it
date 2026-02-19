import { appendToBody, assertString } from '@/utils';
import type { Resource } from '../type';

/**
 * Prism.js Engine
 * Syntax highlighting engine powered by Prism.js
 */
export default abstract class BaseEngine {
    private static loadedResources = new Set<string>();

    abstract initialize(): Promise<void>;

    abstract highlight(): Promise<void>;

    public async loadResource(resource: Resource): Promise<void> {
        // Check if this resource is already loaded
        if (BaseEngine.isResourceLoaded(resource)) {
            return;
        }

        // If there are dependencies, wait for them to load first
        if (resource.dependencies && resource.dependencies.length > 0) {
            await Promise.all(resource.dependencies.map((dep) => this.loadResource(dep)));
        }

        // Load the current resource and mark it as loaded
        assertString(resource.script) && (await appendToBody({ tagName: 'script', src: resource.script }));
        assertString(resource.link) && (await appendToBody({ tagName: 'link', src: resource.link }));

        BaseEngine.addResourceLoaded(resource);
    }

    public static isResourceLoaded(resource: Resource): boolean {
        return (
            (assertString(resource.script) && BaseEngine.loadedResources.has(resource.script)) ||
            (assertString(resource.link) && BaseEngine.loadedResources.has(resource.link))
        );
    }

    public static addResourceLoaded(resource: Resource) {
        assertString(resource.script) && BaseEngine.loadedResources.add(resource.script);
        assertString(resource.link) && BaseEngine.loadedResources.add(resource.link);
    }

    /**
     * Waits for a condition to be met within a timeout period.
     */
    public waitUntil(condition: () => boolean, timeout = 15000): Promise<void> {
        return new Promise((resolve, reject) => {
            if (condition()) {
                resolve();
                return;
            }

            try {
                const startTime = Date.now();
                const interval = setInterval(() => {
                    if (condition()) {
                        clearInterval(interval);
                        resolve();
                    } else if (Date.now() - startTime > timeout) {
                        clearInterval(interval);
                        reject(new Error('Highlighting engine failed to load within expected time.'));
                    }
                }, 50);
            } catch (error) {
                reject(error);
            }
        });
    }
}
