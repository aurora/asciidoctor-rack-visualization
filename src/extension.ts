/**
 * Asciidoctor Rack Visualization Extension
 * 
 * This extension provides block processors for rendering server rack diagrams
 * from RackML XML or text markup in AsciiDoc documents.
 * 
 * @author Harald Lapp
 * @version 1.0.0
 * @license MIT
 */

import { RackVisualization } from './rack-visualization';

interface AsciidoctorRegistry {
  block(name: string, processor: any): void;
}

interface AsciidoctorProcessor {
  named(name: string): void;
  onContext(context: string): void;
  parseContentAs(type: string): void;
  process(fn: (parent: any, reader: any, attrs: any) => any): void;
  createBlock(parent: any, context: string, content: string, attrs: any): any;
}

interface AsciidoctorReader {
  getString(): string;
}

interface AsciidoctorBlock {
  addRole(role: string): void;
}

/**
 * Main extension function that registers all block processors
 */
export function activate(registry: AsciidoctorRegistry): void {
  const rackViz = new RackVisualization();

  // Register rack-xml block processor
  registry.block('rack-xml', function(this: AsciidoctorProcessor) {
    const self = this;
    self.named('rack-xml');
    self.onContext('listing');
    self.parseContentAs('raw');
    
    self.process(function(parent: any, reader: AsciidoctorReader, attrs: any) {
      const content = reader.getString();
      
      try {
        const svgContent = rackViz.parseRackMLAndGenerateSvg(content);
        return self.createBlock(parent, 'pass', svgContent, attrs);
      } catch (error) {
        const errorMessage = `Error parsing RackML XML: ${error instanceof Error ? error.message : String(error)}`;
        const errorBlock = self.createBlock(parent, 'paragraph', errorMessage, attrs) as AsciidoctorBlock;
        errorBlock.addRole('rack-error');
        return errorBlock;
      }
    });
  });

  // Register rack-text block processor
  registry.block('rack-text', function(this: AsciidoctorProcessor) {
    const self = this;
    self.named('rack-text');
    self.onContext('listing');
    self.parseContentAs('raw');
    
    self.process(function(parent: any, reader: AsciidoctorReader, attrs: any) {
      const content = reader.getString();
      
      try {
        const svgContent = rackViz.parseTextMarkupAndGenerateSvg(content);
        return self.createBlock(parent, 'pass', svgContent, attrs);
      } catch (error) {
        const errorMessage = `Error parsing rack text markup: ${error instanceof Error ? error.message : String(error)}`;
        const errorBlock = self.createBlock(parent, 'paragraph', errorMessage, attrs) as AsciidoctorBlock;
        errorBlock.addRole('rack-error');
        return errorBlock;
      }
    });
  });

  // Register alternative block names for convenience
  registry.block('rackml', function(this: AsciidoctorProcessor) {
    const self = this;
    self.named('rackml');
    self.onContext('listing');
    self.parseContentAs('raw');
    
    self.process(function(parent: any, reader: AsciidoctorReader, attrs: any) {
      const content = reader.getString();
      
      try {
        const svgContent = rackViz.parseRackMLAndGenerateSvg(content);
        return self.createBlock(parent, 'pass', svgContent, attrs);
      } catch (error) {
        const errorMessage = `Error parsing RackML XML: ${error instanceof Error ? error.message : String(error)}`;
        const errorBlock = self.createBlock(parent, 'paragraph', errorMessage, attrs) as AsciidoctorBlock;
        errorBlock.addRole('rack-error');
        return errorBlock;
      }
    });
  });

  registry.block('rack', function(this: AsciidoctorProcessor) {
    const self = this;
    self.named('rack');
    self.onContext('listing');
    self.parseContentAs('raw');
    
    self.process(function(parent: any, reader: AsciidoctorReader, attrs: any) {
      const content = reader.getString();
      
      try {
        const svgContent = rackViz.parseTextMarkupAndGenerateSvg(content);
        return self.createBlock(parent, 'pass', svgContent, attrs);
      } catch (error) {
        const errorMessage = `Error parsing rack text markup: ${error instanceof Error ? error.message : String(error)}`;
        const errorBlock = self.createBlock(parent, 'paragraph', errorMessage, attrs) as AsciidoctorBlock;
        errorBlock.addRole('rack-error');
        return errorBlock;
      }
    });
  });
}

/**
 * Extension metadata for Asciidoctor
 */
export const extension = {
  name: 'rack-visualization',
  version: '1.0.0',
  description: 'Asciidoctor extension for rendering server rack diagrams from RackML XML or text markup',
  author: 'Harald Lapp',
  license: 'MIT',
  keywords: ['asciidoctor', 'extension', 'rack', 'visualization', 'diagram', 'server', 'svg', 'rackml'],
  activate
};

// Default export for compatibility
export default activate;