# Installation Guide

This guide shows different ways to install and use the Asciidoctor Rack Visualization Extension in various environments.

## 📦 Download Options

### Option 1: GitHub Releases (Recommended)

Download the latest pre-built release:

```bash
# Download latest release
wget https://github.com/aurora/asciidoctor-rack-visualization/releases/latest/download/asciidoctor-rack-visualization.tar.gz

# Extract
tar -xzf asciidoctor-rack-visualization.tar.gz
cd asciidoctor-rack-visualization

# The extension is ready to use in lib/index.js
```

### Option 2: Git Clone and Build

```bash
# Clone repository
git clone https://github.com/aurora/asciidoctor-rack-visualization.git
cd asciidoctor-rack-visualization

# Install dependencies and build
npm install
npm run build

# Extension is now available in lib/index.js
```

### Option 3: NPM from GitHub

```bash
# Install directly from GitHub
npm install https://github.com/aurora/asciidoctor-rack-visualization/archive/main.tar.gz

# Or install specific release
npm install https://github.com/aurora/asciidoctor-rack-visualization/releases/download/v1.0.0/asciidoctor-rack-visualization.tar.gz
```

## 🔧 Integration Methods

### 1. Local Asciidoctor Installation

#### Method A: Direct CLI Usage

```bash
# Create extension wrapper
echo "const ext = require('./path/to/asciidoctor-rack-visualization/lib/index.js'); module.exports.register = (reg) => ext(reg);" > rack-ext.js

# Use with asciidoctor CLI
asciidoctor -r ./rack-ext.js document.adoc
```

#### Method B: Global Extension

```bash
# Install globally (requires sudo on Linux/Mac)
sudo mkdir -p /usr/local/lib/asciidoctor-extensions
sudo cp -r asciidoctor-rack-visualization /usr/local/lib/asciidoctor-extensions/

# Create global extension file
sudo tee /usr/local/lib/asciidoctor-extensions/rack.js > /dev/null <<EOF
const rackExtension = require('./asciidoctor-rack-visualization/lib/index.js');
module.exports.register = function (registry) {
  rackExtension(registry);
};
EOF

# Use globally
asciidoctor -r /usr/local/lib/asciidoctor-extensions/rack.js document.adoc
```

### 2. Node.js Projects

#### Method A: Direct Integration

```javascript
// app.js
const asciidoctor = require('@asciidoctor/core')();
const rackExtension = require('./extensions/asciidoctor-rack-visualization/lib/index.js');

// Register extension
asciidoctor.Extensions.register(rackExtension);

// Convert documents
const html = asciidoctor.convert(adocContent, { safe: 'unsafe' });
```

#### Method B: Package.json Scripts

```json
{
  "scripts": {
    "setup-extensions": "git clone https://github.com/aurora/asciidoctor-rack-visualization.git extensions/rack-viz && cd extensions/rack-viz && npm install && npm run build",
    "build-docs": "asciidoctor -r ./extensions/rack-ext.js docs/*.adoc",
    "build-pdf": "asciidoctor-pdf -r ./extensions/rack-ext.js docs/*.adoc"
  }
}
```

### 3. Docker Environments

#### Method A: Multi-stage Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine AS builder
RUN git clone https://github.com/aurora/asciidoctor-rack-visualization.git /tmp/rack-ext
WORKDIR /tmp/rack-ext
RUN npm install && npm run build

# Runtime stage
FROM node:18-alpine
RUN npm install -g @asciidoctor/cli

# Copy built extension
COPY --from=builder /tmp/rack-ext/lib /usr/local/lib/rack-visualization
COPY --from=builder /tmp/rack-ext/package.json /usr/local/lib/rack-visualization/

# Create extension file
RUN echo "const ext = require('/usr/local/lib/rack-visualization/index.js'); module.exports.register = (reg) => ext(reg);" > /usr/local/lib/rack-ext.js

WORKDIR /docs
CMD ["asciidoctor", "-r", "/usr/local/lib/rack-ext.js"]
```

#### Method B: Simple Dockerfile

```dockerfile
FROM node:18-alpine

# Install Asciidoctor
RUN npm install -g @asciidoctor/cli

# Install extension
RUN git clone https://github.com/aurora/asciidoctor-rack-visualization.git /opt/rack-ext && \
    cd /opt/rack-ext && \
    npm install && \
    npm run build && \
    echo "const ext = require('/opt/rack-ext/lib/index.js'); module.exports.register = (reg) => ext(reg);" > /opt/rack-ext.js

WORKDIR /docs
ENTRYPOINT ["asciidoctor", "-r", "/opt/rack-ext.js"]
```

### 4. CI/CD Pipelines

#### GitHub Actions

```yaml
name: Build Documentation
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install Asciidoctor
        run: npm install -g @asciidoctor/cli
      
      - name: Setup Rack Extension
        run: |
          wget https://github.com/aurora/asciidoctor-rack-visualization/releases/latest/download/asciidoctor-rack-visualization.tar.gz
          tar -xzf asciidoctor-rack-visualization.tar.gz
          echo "const ext = require('./asciidoctor-rack-visualization/lib/index.js'); module.exports.register = (reg) => ext(reg);" > rack-ext.js
      
      - name: Build Documentation
        run: asciidoctor -r ./rack-ext.js -D dist docs/*.adoc
```

#### GitLab CI

```yaml
pages:
  image: node:18
  before_script:
    - npm install -g @asciidoctor/cli
    - wget https://github.com/aurora/asciidoctor-rack-visualization/releases/latest/download/asciidoctor-rack-visualization.tar.gz
    - tar -xzf asciidoctor-rack-visualization.tar.gz
    - echo "const ext = require('./asciidoctor-rack-visualization/lib/index.js'); module.exports.register = (reg) => ext(reg);" > rack-ext.js
  script:
    - asciidoctor -r ./rack-ext.js -D public docs/*.adoc
  artifacts:
    paths:
      - public
```

### 5. Antora Documentation Sites

#### Method A: Git Submodule

```bash
# Add as submodule
git submodule add https://github.com/aurora/asciidoctor-rack-visualization.git extensions/rack-visualization

# Build extension
cd extensions/rack-visualization
npm install && npm run build
cd ../..

# Create extension file
echo "const ext = require('./extensions/rack-visualization/lib/index.js'); module.exports.register = (reg) => ext(reg);" > extensions/rack-ext.js
```

Then in `antora-playbook.yml`:

```yaml
asciidoc:
  extensions:
    - ./extensions/rack-ext.js
```

#### Method B: Download in Build

```yaml
# antora-playbook.yml
asciidoc:
  extensions:
    - ./extensions/rack-ext.js

# In your build script:
# wget https://github.com/aurora/asciidoctor-rack-visualization/releases/latest/download/asciidoctor-rack-visualization.tar.gz
# tar -xzf asciidoctor-rack-visualization.tar.gz -C extensions/
# echo "const ext = require('./asciidoctor-rack-visualization/lib/index.js'); module.exports.register = (reg) => ext(reg);" > extensions/rack-ext.js
```

## 🔍 Verification

Test your installation:

```bash
# Create test document
cat > test.adoc << EOF
= Test Document

[rack-xml]
----
<racks>
  <rack name="Test Rack" height="10">
    <server height="2">Test Server</server>
    <switch>Test Switch</switch>
  </rack>
</racks>
----
EOF

# Convert with extension
asciidoctor -r ./rack-ext.js test.adoc

# Check if SVG is generated
grep -q "<svg" test.html && echo "✅ Extension working!" || echo "❌ Extension not working"
```

## 🛠️ Troubleshooting

### Common Issues

1. **"Cannot find module" error**
   - Ensure the path to the extension is correct
   - Check that `npm run build` was executed

2. **"Extension not registered" error**
   - Verify the extension wrapper file syntax
   - Ensure `safe: 'unsafe'` is set when using programmatically

3. **SVG not rendering**
   - Check browser console for JavaScript errors
   - Verify the extension is loaded before document conversion

### Debug Mode

Enable debug output:

```javascript
// In your extension wrapper
const rackExtension = require('./path/to/lib/index.js');
console.log('Loading rack extension:', rackExtension);

module.exports.register = function (registry) {
  console.log('Registering rack extension');
  rackExtension(registry);
  console.log('Rack extension registered');
};
```

## 📞 Support

If you encounter issues:

1. Check the [GitHub Issues](https://github.com/aurora/asciidoctor-rack-visualization/issues)
2. Create a new issue with:
   - Your installation method
   - Node.js and Asciidoctor versions
   - Error messages
   - Minimal reproduction case