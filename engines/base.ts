/**
 * Prism.js Engine
 * Syntax highlighting engine powered by Prism.js
 */
export default abstract class BaseEngine {

    abstract initialize(): Promise<void>;

    abstract highlight(): Promise<void>;

    public appendTo(resource: { tagName: 'script' | 'link'; src: string }, place: 'head' | 'body' = 'head'): Promise<void> {
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

        if (place === 'body') document.body.appendChild(element);
        else document.head.appendChild(element);

        return promise;
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
