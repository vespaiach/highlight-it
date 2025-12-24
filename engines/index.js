// @ts-check
/**
 * Engine Registry
 * Central registry for all available highlighting engines
 * @type {import('../types').EngineRegistry}
 */
import prism from "./prism.js";

// Export all available engines
export default {
  prism,
  // Future engines can be added here:
  // highlightjs: () => import('./highlightjs.js'),
  // shiki: () => import('./shiki.js'),
};
