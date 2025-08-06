# Asciidoctor Rack Visualization Extension

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js CI](https://github.com/aurora/asciidoctor-rack-visualization/workflows/CI/badge.svg)](https://github.com/aurora/asciidoctor-rack-visualization/actions)
[![GitHub release](https://img.shields.io/github/release/aurora/asciidoctor-rack-visualization.svg)](https://github.com/aurora/asciidoctor-rack-visualization/releases)

**Asciidoctor extension for rendering server rack diagrams from RackML XML or text markup.**

This extension provides a seamless way to create professional server rack diagrams directly in your AsciiDoc documents. It works exactly like other popular diagram extensions (Mermaid, PlantUML, Kroki) and integrates perfectly with all Asciidoctor toolchains.

## 📦 Installation

### Method 1: Direct Download from GitHub Releases

```bash
# Download latest release
wget https://github.com/aurora/asciidoctor-rack-visualization/releases/latest/download/asciidoctor-rack-visualization.tar.gz

# Extract
tar -xzf asciidoctor-rack-visualization.tar.gz

# Install dependencies (if needed)
cd asciidoctor-rack-visualization
npm install --production
```

### Method 2: Git Clone and Build

```bash
# Clone repository
git clone https://github.com/aurora/asciidoctor-rack-visualization.git
cd asciidoctor-rack-visualization

# Install dependencies and build
npm install
npm run build
```

### Method 3: NPM from GitHub

```bash
# Install directly from GitHub
npm install https://github.com/aurora/asciidoctor-rack-visualization/archive/main.tar.gz

# Or install specific release
npm install https://github.com/aurora/asciidoctor-rack-visualization/releases/download/v1.0.0/asciidoctor-rack-visualization.tar.gz
```

### Method 4: Git Submodule (for Documentation Projects)

```bash
# Add as submodule
git submodule add https://github.com/aurora/asciidoctor-rack-visualization.git extensions/rack-visualization

# Initialize and build
cd extensions/rack-visualization
npm install
npm run build
```

## 🚀 Quick Start

## 🔧 Usage in Asciidoctor

### Method 1: Node.js/JavaScript Integration

#### Direct Registration (Recommended)

```javascript
const asciidoctor = require('@asciidoctor/core')();
const rackExtension = require('./path/to/asciidoctor-rack-visualization/lib/index.js');

// Register the extension
asciidoctor.Extensions.register(rackExtension);

// Convert your document
const html = asciidoctor.convert(adocContent, { safe: 'unsafe' });
```

#### Using the register function

```javascript
const asciidoctor = require('@asciidoctor/core')();
const { register } = require('./path/to/asciidoctor-rack-visualization/lib/index.js');

// Register the extension
register(asciidoctor.Extensions);

const html = asciidoctor.convert(adocContent, { safe: 'unsafe' });
```

### Method 2: Asciidoctor CLI

#### Option A: Extension File

Create an extension file `rack-extension.js`:

```javascript
const rackExtension = require('./path/to/asciidoctor-rack-visualization/lib/index.js');
module.exports.register = function (registry) {
  rackExtension(registry);
};
```

Then use with CLI:

```bash
asciidoctor -r ./rack-extension.js document.adoc
```

#### Option B: Direct Require

```bash
# If installed via npm
asciidoctor -r asciidoctor-rack-visualization document.adoc

# If using local path
asciidoctor -r ./extensions/rack-visualization/lib/index.js document.adoc
```

### Method 3: Global Installation

#### Install globally for system-wide use

```bash
# Clone to a global location
sudo git clone https://github.com/aurora/asciidoctor-rack-visualization.git /usr/local/lib/asciidoctor-extensions/rack-visualization
cd /usr/local/lib/asciidoctor-extensions/rack-visualization
sudo npm install
sudo npm run build

# Create global extension file
sudo tee /usr/local/lib/asciidoctor-extensions/rack-extension.js > /dev/null <<EOF
const rackExtension = require('./rack-visualization/lib/index.js');
module.exports.register = function (registry) {
  rackExtension(registry);
};
EOF
```

Then use globally:

```bash
asciidoctor -r /usr/local/lib/asciidoctor-extensions/rack-extension.js document.adoc
```

### Method 4: Project-Specific Integration

#### Add to your project's package.json

```json
{
  "scripts": {
    "build-docs": "asciidoctor -r ./extensions/rack-extension.js docs/*.adoc",
    "build-html": "asciidoctor -r ./extensions/rack-extension.js -D dist docs/",
    "build-pdf": "asciidoctor-pdf -r ./extensions/rack-extension.js docs/"
  },
  "dependencies": {
    "@asciidoctor/core": "^2.2.0"
  }
}
```

#### Create project extension file `extensions/rack-extension.js`:

```javascript
const path = require('path');
const rackExtension = require(path.join(__dirname, 'rack-visualization', 'lib', 'index.js'));

module.exports.register = function (registry) {
  rackExtension(registry);
};
```

### Method 5: Docker Integration

#### Dockerfile for documentation builds

```dockerfile
FROM node:18-alpine

# Install Asciidoctor CLI
RUN npm install -g @asciidoctor/cli

# Copy extension
COPY extensions/rack-visualization /usr/local/lib/rack-visualization
WORKDIR /usr/local/lib/rack-visualization
RUN npm install --production && npm run build

# Create extension file
RUN echo "const ext = require('/usr/local/lib/rack-visualization/lib/index.js'); \
module.exports.register = (reg) => ext(reg);" > /usr/local/lib/rack-ext.js

# Set working directory for docs
WORKDIR /docs

# Default command
CMD ["asciidoctor", "-r", "/usr/local/lib/rack-ext.js"]
```

Usage:

```bash
docker build -t my-asciidoctor .
docker run --rm -v $(pwd)/docs:/docs my-asciidoctor document.adoc
```

## 🏗️ Framework Integration

### Antora Documentation Sites

#### Option 1: Git Submodule

Add the extension as a submodule and configure in `antora-playbook.yml`:

```yaml
asciidoc:
  extensions:
    - ./extensions/rack-visualization/lib/index.js
```

#### Option 2: Custom Extension

Create `extensions/rack-extension.js`:

```javascript
const rackExtension = require('./rack-visualization/lib/index.js');
module.exports.register = function (registry) {
  rackExtension(registry);
};
```

Then in `antora-playbook.yml`:

```yaml
asciidoc:
  extensions:
    - ./extensions/rack-extension.js
```

### GitLab Pages

```yaml
# .gitlab-ci.yml
pages:
  image: node:18
  before_script:
    - npm install -g @asciidoctor/cli
    - git clone https://github.com/aurora/asciidoctor-rack-visualization.git extensions/rack-viz
    - cd extensions/rack-viz && npm install && npm run build && cd ../..
    - echo "const ext = require('./extensions/rack-viz/lib/index.js'); module.exports.register = (reg) => ext(reg);" > rack-ext.js
  script:
    - asciidoctor -r ./rack-ext.js -D public docs/*.adoc
  artifacts:
    paths:
      - public
```

### GitHub Actions

```yaml
# .github/workflows/docs.yml
name: Build Documentation
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          submodules: recursive  # if using submodules
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install Asciidoctor
        run: npm install -g @asciidoctor/cli
      
      - name: Setup Rack Extension
        run: |
          git clone https://github.com/aurora/asciidoctor-rack-visualization.git extensions/rack-viz
          cd extensions/rack-viz
          npm install
          npm run build
          cd ../..
          echo "const ext = require('./extensions/rack-viz/lib/index.js'); module.exports.register = (reg) => ext(reg);" > rack-ext.js
      
      - name: Build Documentation
        run: asciidoctor -r ./rack-ext.js -D dist docs/*.adoc
      
      - name: Deploy to GitHub Pages
        uses: actions/upload-pages-artifact@v1
        with:
          path: dist
```

### Makefile Integration

```makefile
# Makefile
ASCIIDOCTOR_OPTS = -r ./extensions/rack-ext.js

# Setup extension
setup-extension:
	@if [ ! -d "extensions/rack-visualization" ]; then \
		git clone https://github.com/aurora/asciidoctor-rack-visualization.git extensions/rack-visualization; \
	fi
	cd extensions/rack-visualization && npm install && npm run build
	echo "const ext = require('./rack-visualization/lib/index.js'); module.exports.register = (reg) => ext(reg);" > extensions/rack-ext.js

# Build documentation
docs: setup-extension
	asciidoctor $(ASCIIDOCTOR_OPTS) -D dist docs/*.adoc

# Build PDF
pdf: setup-extension
	asciidoctor-pdf $(ASCIIDOCTOR_OPTS) -D dist docs/*.adoc

.PHONY: setup-extension docs pdf
```

## AsciiDoc-Syntax

### RackML XML Format

```asciidoc
[rack-xml]
----
<racks>
  <rack name="Server Rack 1" height="42">
    <server height="2">Web Server 1</server>
    <switch>Network Switch</switch>
    <server height="2">Database Server</server>
  </rack>
</racks>
----
```

### Text-Markup Format

```asciidoc
[rack-text]
----
caption: My Server Rack
height: 42
items:
- server[2]: Web Server 1
- switch: Network Switch
- server[2]: Database Server
----
```

### Alternative Namen

Sie können auch die kürzeren Namen verwenden:

```asciidoc
[rackml]
----
<racks>
  <rack name="Test Rack" height="10">
    <server>Test Server</server>
  </rack>
</racks>
----
```

```asciidoc
[rack]
----
caption: Test Rack
height: 10
items:
- server: Test Server
----
```

## Unterstützte Gerätetypen

- `server` - Server
- `switch` - Netzwerk-Switch
- `firewall` - Firewall
- `router` - Router
- `storage` - Storage-System
- `pdu` - Power Distribution Unit
- `ups` - Unterbrechungsfreie Stromversorgung
- `patch` - Patch-Panel
- `cables` - Kabel-Management
- `tape` - Tape-Laufwerk
- `monitor` - Monitor
- `keyboard` - Tastatur
- `kvm` - KVM-Switch
- `blank` - Leere Einheit

## Erweiterte Funktionen

### Links in Geräten

```asciidoc
[rack-xml]
----
<racks>
  <rack name="Production Rack" height="42">
    <server height="2" href="https://server1.example.com">Web Server 1</server>
    <switch href="https://switch.example.com">Core Switch</switch>
  </rack>
</racks>
----
```

```asciidoc
[rack-text]
----
caption: Production Rack
height: 42
items:
- server[2]: [Web Server 1](https://server1.example.com)
- switch: [Core Switch](https://switch.example.com)
----
```

### Benutzerdefinierte Farben

```asciidoc
[rack-xml]
----
<racks>
  <rack name="Colored Rack" height="10">
    <server color="#ff0000">Red Server</server>
    <switch color="#00ff00">Green Switch</switch>
  </rack>
</racks>
----
```

### Positionierung

```asciidoc
[rack-xml]
----
<racks>
  <rack name="Positioned Rack" height="42">
    <server height="2" at="1">Top Server</server>
    <switch at="10">Middle Switch</switch>
    <server height="2" at="40">Bottom Server</server>
  </rack>
</racks>
----
```

## Fehlerbehandlung

Wenn ein Parsing-Fehler auftritt, wird eine Fehlermeldung anstelle des SVG-Diagramms angezeigt. Die Fehlermeldung erhält die CSS-Klasse `rack-error` für benutzerdefinierte Styling-Optionen.

## CSS-Styling

Das generierte SVG kann mit CSS gestylt werden:

```css
/* Fehlerbehandlung */
.rack-error {
  color: red;
  border: 1px solid red;
  padding: 1em;
  background-color: #ffe6e6;
}

/* SVG-Styling */
svg {
  max-width: 100%;
  height: auto;
}
```

## Abhängigkeiten

- `rack-visualization-js` - Die Kern-Library für Rack-Visualisierung
- `@asciidoctor/core` - Asciidoctor.js (Peer-Dependency)

## 🎯 Features

- ✅ **Multiple Formats**: RackML XML and intuitive text markup
- ✅ **Responsive SVG**: Automatically scales to container width
- ✅ **Clickable Links**: Components can link to monitoring dashboards
- ✅ **Custom Colors**: Brand your diagrams with custom color schemes
- ✅ **Precise Positioning**: Control exact rack unit positions
- ✅ **Multiple Racks**: Show entire datacenter layouts
- ✅ **Error Handling**: Graceful error messages with styling hooks
- ✅ **TypeScript**: Full type definitions included
- ✅ **Framework Ready**: Works with Antora, GitLab, GitHub, Docker
- ✅ **Zero Config**: Works out of the box like Mermaid or PlantUML

## 📚 Documentation

- [Basic Usage Examples](examples/basic-usage.adoc)
- [Advanced Features](examples/advanced-features.adoc)
- [CLI Usage Guide](USAGE.md)
- [Changelog](CHANGELOG.md)

## 🤝 Contributing

We welcome contributions! This extension is designed to work seamlessly with Asciidoctor.

1. Fork the repository on GitHub
2. Clone your fork: `git clone https://github.com/your-username/asciidoctor-rack-visualization.git`
3. Create a feature branch: `git checkout -b feature/your-feature`
4. Make your changes and add tests
5. Build and test: `npm install && npm run build && npm test`
6. Submit a pull request

### Development Setup

```bash
# Clone the repository
git clone https://github.com/aurora/asciidoctor-rack-visualization.git
cd asciidoctor-rack-visualization

# Install dependencies
npm install

# Build the extension
npm run build

# Run tests
npm test

# Run with Asciidoctor integration test
npm install @asciidoctor/core
npm run test:integration
```

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built on top of the powerful [Asciidoctor.js](https://asciidoctor.org/) ecosystem
- Inspired by other excellent diagram extensions like Mermaid and PlantUML
- Uses `rack-visualization-js` for core rendering capabilities

## 📋 Requirements

- Node.js 14.0.0 or higher
- @asciidoctor/core 2.2.0 or higher
- Modern browser for SVG rendering

## 🔗 Links

- [GitHub Repository](https://github.com/aurora/asciidoctor-rack-visualization)
- [Issues & Bug Reports](https://github.com/aurora/asciidoctor-rack-visualization/issues)
- [Releases](https://github.com/aurora/asciidoctor-rack-visualization/releases)
- [Asciidoctor.js Documentation](https://docs.asciidoctor.org/asciidoctor.js/latest/)

---

**Ready to document your infrastructure?** Download the extension from GitHub and start creating professional rack diagrams in your AsciiDoc documents today!