/**
 * Extension Registration Module
 * 
 * This module provides different ways to register the extension
 * following Asciidoctor extension conventions.
 */

import { activate } from './extension';

/**
 * Register function for use with Asciidoctor CLI
 * Usage: asciidoctor -r asciidoctor-rack-visualization/register document.adoc
 */
export function register(registry: any): void {
  activate(registry);
}

/**
 * Auto-registration for environments that support it
 * This will be called automatically when the module is loaded
 * in certain contexts (like Antora)
 */
if (typeof global !== 'undefined' && (global as any).Asciidoctor) {
  (global as any).Asciidoctor.Extensions.register(activate);
}

// For CommonJS environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { register };
  module.exports.register = register;
}

// Default export
export default register;