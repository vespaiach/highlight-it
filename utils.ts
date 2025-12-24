/**
 * Dynamically adds a script or stylesheet element to the document.
 */
export function addElement(resource: { tagName: "script" | "link"; src: string }): Promise<void> {
	const { tagName, src } = resource;

	return new Promise((resolve, reject) => {
		if (tagName === "link") {
			const element = document.createElement("link");
			element.onload = () => { resolve(); }
			element.onerror = () => {
				reject(new Error(`Failed to load ${tagName}: ${src}`));
			}
			element.rel = "stylesheet";
			element.href = src;
			debugger
			document.head.appendChild(element);
		} else {
			const element = document.createElement("script");
			element.onload = () => { resolve(); }
			element.onerror = () => {
				reject(new Error(`Failed to load ${tagName}: ${src}`));
			}
			element.defer = true;
			element.src = src;
			document.body.appendChild(element);
		}
	});
}

/**
 * Waits for a condition to be met within a timeout period.
 */
export function waitForCondition(condition: () => boolean, timeout = 15000): Promise<void> {
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
					reject(
						new Error(
							"Highlighting engine failed to load within expected time."
						)
					);
				}
			}, 50);
		} catch (error) {
			reject(error);
		}
	});
}

/**
 * Logger utility that respects verbose configuration
 */
let verboseMode = false;

export function setVerbose(enabled: boolean): void {
	verboseMode = enabled;
}

export function log(...args: any[]): void {
	if (verboseMode) {
		console.log(...args);
	}
}

export function warn(...args: any[]): void {
	if (verboseMode) {
		console.warn(...args);
	}
}

export function error(...args: any[]): void {
	// Errors are always shown regardless of verbose mode
	console.error(...args);
}