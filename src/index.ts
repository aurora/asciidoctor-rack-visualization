/**
 * Asciidoctor Rack Visualization Extension
 * 
 * Official Asciidoctor extension for rendering server rack diagrams.
 * This extension follows the official Asciidoctor extension standards
 * and can be used as a drop-in replacement for other diagram extensions.
 * 
 * @package asciidoctor-rack-visualization
 * @author Harald Lapp
 * @version 1.0.0
 * @license MIT
 */

import { activate, extension } from './extension';

// Export the extension metadata
export { extension };

// Main extension function for direct registration
export function register(registry: any): void {
  activate(registry);
}

// Default export following Asciidoctor extension conventions
export default function rackVisualizationExtension(registry: any): void {
  activate(registry);
}

// Named export for the activate function
export { activate };

// Extension information for package managers and documentation
export const info = {
  name: extension.name,
  version: extension.version,
  description: extension.description,
  author: extension.author,
  license: extension.license,
  keywords: extension.keywords,
  homepage: 'https://github.com/aurora/asciidoctor-rack-visualization',
  repository: {
    type: 'git',
    url: 'https://github.com/aurora/asciidoctor-rack-visualization.git'
  },
  bugs: {
    url: 'https://github.com/aurora/asciidoctor-rack-visualization/issues'
  },
  // Supported block types
  blocks: ['rack-xml', 'rack-text', 'rackml', 'rack'],
  // Extension capabilities
  capabilities: {
    svg: true,
    responsive: true,
    links: true,
    colors: true,
    positioning: true,
    multipleRacks: true
  }
};

// For CommonJS compatibility
module.exports = rackVisualizationExtension;
module.exports.register = register;
module.exports.activate = activate;
module.exports.extension = extension;
module.exports.info = info;
module.exports.default = rackVisualizationExtension;