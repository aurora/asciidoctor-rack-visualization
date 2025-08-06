const fs = require('fs');
const path = require('path');

// Test the extension without requiring @asciidoctor/core as a dependency
// This is a simple test to verify the extension can be loaded and basic functionality works

console.log('Testing Asciidoctor Rack Visualization Extension...');

try {
  // Try to load the compiled extension
  const extensionPath = path.join(__dirname, '..', 'lib', 'index.js');
  
  if (!fs.existsSync(extensionPath)) {
    console.error('Extension not built yet. Run "npm run build" first.');
    process.exit(1);
  }
  
  const extension = require(extensionPath);
  
  if (typeof extension.default === 'function') {
    console.log('✓ Extension loaded successfully');
    console.log('✓ Default export is a function');
  } else {
    console.error('✗ Extension default export is not a function');
    process.exit(1);
  }
  
  if (typeof extension.register === 'function') {
    console.log('✓ Register function is available');
  } else {
    console.error('✗ Register function is not available');
    process.exit(1);
  }
  
  console.log('\nBasic tests passed! ✓');
  console.log('\nTo test with actual Asciidoctor, install @asciidoctor/core and run:');
  console.log('node test/integration-test.js');
  
} catch (error) {
  console.error('✗ Error loading extension:', error.message);
  process.exit(1);
}